package world.inclub.bonusesrewards.shared.payment.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.member.domain.port.MemberRepositoryPort;
import world.inclub.bonusesrewards.shared.payment.application.dto.MakePaymentCommand;
import world.inclub.bonusesrewards.shared.payment.application.factory.PaymentFactory;
import world.inclub.bonusesrewards.shared.payment.application.factory.PaymentVoucherFactory;
import world.inclub.bonusesrewards.shared.payment.application.mapper.PaymentMapper;
import world.inclub.bonusesrewards.shared.payment.application.service.interfaces.PaymentAmountValidationService;
import world.inclub.bonusesrewards.shared.payment.application.service.interfaces.VoucherStorageService;
import world.inclub.bonusesrewards.shared.payment.application.service.interfaces.PaymentNotificationService;
import world.inclub.bonusesrewards.shared.payment.application.service.interfaces.PaymentService;
import world.inclub.bonusesrewards.shared.payment.domain.model.CurrencyType;
import world.inclub.bonusesrewards.shared.payment.domain.model.Payment;
import world.inclub.bonusesrewards.shared.payment.domain.model.PaymentStatus;
import world.inclub.bonusesrewards.shared.payment.domain.model.PaymentVoucher;
import world.inclub.bonusesrewards.shared.payment.domain.port.CarPaymentScheduleRepositoryPort;
import world.inclub.bonusesrewards.shared.payment.domain.port.PaymentRepositoryPort;
import world.inclub.bonusesrewards.shared.payment.domain.port.PaymentVoucherRepositoryPort;
import world.inclub.bonusesrewards.shared.payment.domain.port.WalletRepositoryPort;
import world.inclub.bonusesrewards.shared.payment.infrastructure.controllers.dto.response.PaymentResponseDto;
import world.inclub.bonusesrewards.shared.payment.infrastructure.exceptions.BadRequestException;
import world.inclub.bonusesrewards.shared.payment.infrastructure.exceptions.NotFoundException;

import java.time.Instant;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private PaymentRepositoryPort paymentRepositoryPort;
    private CarPaymentScheduleRepositoryPort carPaymentScheduleRepositoryPort;
    private WalletRepositoryPort walletRepositoryPort;
    private MemberRepositoryPort memberRepositoryPort;
    private PaymentVoucherRepositoryPort  paymentVoucherRepositoryPort;

    private PaymentAmountValidationService paymentAmountValidationService;
    private PaymentNotificationService paymentNotificationService;
    private VoucherStorageService  voucherStorageService;

    private PaymentFactory paymentFactory;
    private PaymentVoucherFactory paymentVoucherFactory;

    private PaymentMapper paymentMapper;

    @Override
    @Transactional
    public Mono<String> processPayment(MakePaymentCommand command) {
        return validateScheduleAvailability(command)
                .then(validatePaymentMethod(command))
                .then(paymentAmountValidationService.validateAmounts(command))
                .flatMap(validatedCommand -> createPayment(validatedCommand))
                .flatMap(payment -> saveVouchers(payment, command.voucher())
                        .then(updateScheduleStatus(command.scheduleId(), command.paymentDate()))
                        .then(paymentNotificationService.sendPaymentNotification(payment))
                        .thenReturn(payment))
                .map(paymentMapper::toResponseDto)
                .doOnSuccess(result -> log.info("Payment processed successfully: {}", result.getId()))
                .doOnError(error -> log.error("Error processing payment: {}", error.getMessage()));
    }

    public Mono<Void> validateScheduleAvailability(MakePaymentCommand command) {
        return carPaymentScheduleRepositoryPort.existsById(command.scheduleId())
                .flatMap(exists -> {
                    if (!exists) {
                        return Mono.error(new NotFoundException(
                                "Car payment schedule not found: " + command.scheduleId()));
                    }
                    return Mono.empty();
                })
                .then(carPaymentScheduleRepositoryPort.isSchedulePending(command.scheduleId()))
                .flatMap(isPending -> {
                    if (!isPending) {
                        return Mono.error(new BadRequestException(
                                "Schedule is not pending payment: " + command.scheduleId()));
                    }
                    return Mono.empty();
                });
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
                .switchIfEmpty(Mono.error(new NotFoundException("Wallet not found for user")))
                .flatMap(wallet -> {
                    if (wallet.availableBalance().compareTo(command.totalAmount()) < 0) {
                        return Mono.error(new BadRequestException("Insufficient wallet balance"));
                    }
                    return Mono.empty();
                });
    }

    private Mono<Payment> createPayment(MakePaymentCommand command) {
        return validateMemberExists(command.memberId())
                .then(Mono.defer(() -> {
                    Payment payment = paymentFactory.createPaymentWithPendingStatus(command);
                    return paymentRepositoryPort.save(payment);
                }));
    }

    private Mono<Void> validateMemberExists(Long memberId) {
        return memberRepositoryPort.existsById(memberId)
                .flatMap(exists -> {
                    if (!exists) {
                        return Mono.error(new NotFoundException("Member not found with ID: " + memberId));
                    }
                    return Mono.empty();
                });
    }

    private Mono<Void> saveVouchers(Payment payment, java.util.List<MakePaymentCommand.Voucher> vouchers) {
        return Flux.fromIterable(vouchers)
                .flatMap(voucherCmd -> voucherStorageService.saveVoucher(voucherCmd.image())
                        .flatMap(imageUrl -> {
                            PaymentVoucher voucher = paymentVoucherFactory.createPaymentVoucher(
                                    voucherCmd, payment.getId(), imageUrl);
                            return paymentVoucherRepositoryPort.save(voucher);
                        }))
                .then();
    }

    private Mono<Void> updateScheduleStatus(UUID scheduleId, Instant paymentDate) {
        return carPaymentScheduleRepositoryPort.updateSchedulePayment(
                scheduleId,
                PaymentStatus.COMPLETED.getId(),
                paymentDate
        );
    }

    @Override
    public Mono<PaymentResponseDto> approvePayment(Long paymentId) {
        return null;
    }

    @Override
    public Mono<PaymentResponseDto> rejectPayment(Long paymentId, String reason, String detail) {
        return null;
    }
}