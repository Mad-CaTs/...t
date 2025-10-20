package world.inclub.bonusesrewards.shared.payment.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;
import reactor.util.function.Tuples;
import world.inclub.bonusesrewards.carbonus.domain.port.CarPaymentScheduleRepositoryPort;
import world.inclub.bonusesrewards.shared.exceptions.BadRequestException;
import world.inclub.bonusesrewards.shared.exceptions.NotFoundException;
import world.inclub.bonusesrewards.shared.payment.application.dto.ProcessWalletPaymentCommand;
import world.inclub.bonusesrewards.shared.payment.application.factory.PaymentNotificationFactory;
import world.inclub.bonusesrewards.shared.payment.application.factory.PaymentRejectionFactory;
import world.inclub.bonusesrewards.shared.payment.application.service.interfaces.*;
import world.inclub.bonusesrewards.shared.payment.domain.model.PaymentRejection;
import world.inclub.bonusesrewards.shared.payment.domain.port.*;
import world.inclub.bonusesrewards.shared.payment.application.dto.MakePaymentCommand;
import world.inclub.bonusesrewards.shared.payment.application.dto.PaymentAmounts;
import world.inclub.bonusesrewards.shared.payment.application.factory.PaymentFactory;
import world.inclub.bonusesrewards.shared.payment.application.factory.PaymentVoucherFactory;
import world.inclub.bonusesrewards.shared.payment.api.mapper.PaymentMapper;
import world.inclub.bonusesrewards.shared.payment.domain.model.CurrencyType;
import world.inclub.bonusesrewards.shared.payment.domain.model.Payment;
import world.inclub.bonusesrewards.shared.payment.domain.model.PaymentStatus;
import world.inclub.bonusesrewards.shared.payment.api.dto.PaymentResponseDto;
import world.inclub.bonusesrewards.shared.payment.infrastructure.kafka.producer.PaymentEventProducer;
import world.inclub.bonusesrewards.shared.payment.infrastructure.kafka.topics.PaymentRejectedEvent;
import world.inclub.bonusesrewards.shared.utils.TimeLima;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepositoryPort paymentRepositoryPort;
    private final CarPaymentScheduleRepositoryPort carPaymentScheduleRepositoryPort;
    private final WalletRepositoryPort walletRepositoryPort;
    private final MemberRepositoryPort memberRepositoryPort;
    private final PaymentVoucherRepositoryPort paymentVoucherRepositoryPort;
    private final PaymentRejectionRepositoryPort paymentRejectionRepositoryPort;

    private final PaymentAmountService paymentAmountService;
    private final PaymentNotificationService paymentNotificationService;
    private final VoucherStorageService voucherStorageService;
    private final WalletPaymentService walletPaymentService;

    private final PaymentFactory paymentFactory;
    private final PaymentVoucherFactory paymentVoucherFactory;
    private final PaymentNotificationFactory paymentNotificationFactory;
    private final PaymentRejectionFactory paymentRejectionFactory;

    private final PaymentMapper paymentMapper;

    private final PaymentEventProducer paymentEventProducer;

    @Override
    @Transactional
    public Mono<String> processPayment(MakePaymentCommand command) {
        return validateSchedule(command)
                .then(validatePaymentMethod(command))
                .then(paymentAmountService.validateAndCalculate(command))
                .flatMap(amounts -> createPayment(command, amounts))
                .flatMap(payment -> paymentNotification(payment))
                .then(updateScheduleStatus(command.scheduleId(), command.paymentDate()))
                .thenReturn("Payment processed successfully");
    }

    private Mono<Void> validateSchedule(MakePaymentCommand command) {
        return carPaymentScheduleRepositoryPort.existsById(command.scheduleId())
                .filter(Boolean::booleanValue)
                .switchIfEmpty(Mono.error(new NotFoundException(
                        "Car payment schedule not found: " + command.scheduleId())))

                .then(carPaymentScheduleRepositoryPort.isSchedulePending(command.scheduleId()))
                .filter(isPending -> Boolean.TRUE.equals(isPending))
                .switchIfEmpty(Mono.error(new BadRequestException(
                        "Schedule is not pending payment: " + command.scheduleId())))

                .then(carPaymentScheduleRepositoryPort.getMemberIdByScheduleId(command.scheduleId()))
                .filter(scheduleMemberId -> scheduleMemberId.equals(command.memberId()))
                .switchIfEmpty(Mono.error(new BadRequestException(
                        "Member mismatch for schedule: " + command.scheduleId())))
                .then();
    }

    private Mono<Void> validatePaymentMethod(MakePaymentCommand command) {
        return switch (command.paymentType()) {
            case BCP, INTERBANK, OTHERS -> validateVoucher(command.voucher());
            case WALLET -> validateWallet(command);
            default -> Mono.error(new BadRequestException("Unsupported payment method"));
        };
    }

    private Mono<Void> validateVoucher(MakePaymentCommand.Voucher voucher) {
        if (voucher == null) {
            return Mono.error(new BadRequestException("Voucher is required for this payment method"));
        }
        return Mono.empty();
    }

    private Mono<Void> validateWallet(MakePaymentCommand command) {
        if (command.currencyType() != CurrencyType.USD) {
            return Mono.error(new BadRequestException("Wallet payments must be in USD"));
        }

        return walletRepositoryPort.getByUserId(command.memberId())
                .switchIfEmpty(Mono.error(new NotFoundException("Wallet not found for member")))
                .flatMap(wallet -> {
                    if (wallet.availableBalance().compareTo(command.totalAmount()) < 0) {
                        return Mono.error(new BadRequestException("Insufficient wallet balance"));
                    }
                    return Mono.empty();
                });
    }

    private Mono<Payment> createPayment(MakePaymentCommand command, PaymentAmounts amounts) {
        return memberRepositoryPort.getMemberByIdUser(command.memberId())
                .map(Optional::of)
                .defaultIfEmpty(Optional.empty())
                .flatMap(member -> {
                    Mono<Payment> result;

                    switch (command.paymentType()) {
                        case BCP, INTERBANK, OTHERS -> {
                            result = Mono.zip(
                                            paymentRepositoryPort.save(paymentFactory.createPaymentWithPendingStatus(command, amounts)),
                                            voucherStorageService.saveVoucher(command.voucher().image()))
                                    .flatMap(tuple2 -> {
                                        Payment payment = tuple2.getT1();
                                        String imageUrl = tuple2.getT2();
                                        return paymentVoucherRepositoryPort.save(paymentVoucherFactory.createPaymentVoucher(command, payment.getId(), imageUrl))
                                                .thenReturn(payment);
                                    });
                        }
                        case WALLET -> {
                            ProcessWalletPaymentCommand process =
                                    new ProcessWalletPaymentCommand(command.memberId(), amounts.total(), "Ticket purchase payment");

                            result = walletPaymentService.sendWalletPayment(process)
                                    .then(paymentRepositoryPort.save(paymentFactory.createPaymentWithApprovedStatus(command, amounts)));
                        }
                        default -> {
                            result = Mono.error(new BadRequestException("Unsupported payment method"));
                        }
                    }

                    return result;
                });
    }

    private Mono<Void> paymentNotification(Payment payment) {
        return memberRepositoryPort.getMemberByIdUser(payment.getMemberId())
                .map(member -> Tuples.of(member.email(), member.name() + " " + member.lastName()))
                .flatMap(userData -> {
                    return switch (payment.getStatus()) {
                        case COMPLETED -> paymentNotificationService.sendPaymentNotification(
                                paymentNotificationFactory.toApprovedPaymentMessage(userData, payment));

                        case PENDING -> Mono.empty();

                        case FAILED -> Mono.empty();

                        case PENDING_REVIEW -> Mono.empty();

                        case REJECTED -> paymentRejectionRepositoryPort.findByPaymentId(payment.getId())
                                .flatMap(paymentRejection -> paymentNotificationService.sendPaymentNotification(
                                        paymentNotificationFactory.toTemporalRejectedPaymentMessage(userData, payment, paymentRejection)));
                    };
                });
    }

    private Mono<Void> updateScheduleStatus(UUID scheduleId, LocalDateTime paymentDate) {
        return carPaymentScheduleRepositoryPort.updateSchedulePayment(
                scheduleId,
                PaymentStatus.COMPLETED.getId().intValue(),
                paymentDate
        );
    }

    @Override
    @Transactional
    public Mono<PaymentResponseDto> approvePayment(UUID paymentId) {
        LocalDateTime updatedAt = TimeLima.getLimaTime();

        return paymentRepositoryPort.findById(paymentId)
                .switchIfEmpty(Mono.error(new NotFoundException("Payment with ID " + paymentId + " not found")))
                .filter(payment -> payment.getStatus() == PaymentStatus.PENDING_REVIEW)
                .switchIfEmpty(Mono.error(new BadRequestException("Payment is not in PENDING_REVIEW status")))
                .flatMap(payment -> {
                    payment.setStatus(PaymentStatus.COMPLETED);
                    payment.setUpdatedAt(updatedAt);
                    return paymentRepositoryPort.save(payment);
                })
                .map(paymentMapper::toResponseDto);
    }

    @Override
    @Transactional
    public Mono<PaymentResponseDto> rejectPayment(UUID paymentId, Long reasonId, String detail) {
        LocalDateTime updatedAt = TimeLima.getLimaTime();

        return paymentRepositoryPort.findById(paymentId)
                .switchIfEmpty(Mono.error(new NotFoundException("Payment with ID " + paymentId + " not found")))
                .filter(payment -> payment.getStatus() == PaymentStatus.PENDING_REVIEW)
                .switchIfEmpty(Mono.error(new BadRequestException("Payment is not in PENDING status")))
                .flatMap(payment -> {
                    payment.setStatus(PaymentStatus.REJECTED);
                    payment.setUpdatedAt(updatedAt);
                    return paymentRepositoryPort.save(payment);
                })
                .flatMap(payment -> {
                    PaymentRejection rejection = paymentRejectionFactory.createPaymentRejection(paymentId, reasonId, detail);
                    return paymentRejectionRepositoryPort.save(rejection)
                            .then(Mono.just(payment));
                })
                .map(paymentMapper::toResponseDto);
    }
}