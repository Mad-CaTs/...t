package world.inclub.bonusesrewards.shared.payment.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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

    private final PaymentRepositoryPort paymentRepositoryPort;
    private final CarPaymentScheduleRepositoryPort carPaymentScheduleRepositoryPort;
    private final WalletRepositoryPort walletRepositoryPort;
    private final MemberRepositoryPort memberRepositoryPort;
    private final PaymentVoucherRepositoryPort paymentVoucherRepositoryPort;

    private final PaymentAmountValidationService paymentAmountValidationService;
    private final PaymentNotificationService paymentNotificationService;
    private final VoucherStorageService voucherStorageService;

    private final PaymentFactory paymentFactory;
    private final PaymentVoucherFactory paymentVoucherFactory;

    private final PaymentMapper paymentMapper;

    @Override
    @Transactional
    public Mono<String> processPayment(MakePaymentCommand command) {
        return validateScheduleAvailability(command)
                .then(validateMemberExists(command.memberId()))
                .then(validatePaymentMethod(command))
                .then(paymentAmountValidationService.validateAmounts(command))
                .flatMap(validatedCommand -> createPayment(validatedCommand))
                .flatMap(payment -> saveVoucher(payment, command.voucher())
                        .then(updateScheduleStatus(command.scheduleId(), command.paymentDate()))
                        .then(paymentNotificationService.sendPaymentNotification(payment))
                        .thenReturn("Payment processed successfully"))
                .doOnSuccess(result -> log.info("Payment processed successfully"))
                .doOnError(error -> log.error("Error processing payment: {}", error.getMessage()));
    }

    private Mono<Void> validateScheduleAvailability(MakePaymentCommand command) {
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
                    if (isPending == null || !(isPending instanceof Boolean) || !(Boolean) isPending) {
                        return Mono.error(new BadRequestException(
                                "Schedule is not pending payment: " + command.scheduleId()));
                    }
                    return Mono.empty();
                });
    }

    private Mono<Void> validateMemberExists(Long memberId) {
        return memberRepositoryPort.existsById(memberId)
                .flatMap(exists -> {
                    if (!exists) {
                        return Mono.error(new NotFoundException("Member not found with ID: " + memberId));
                    }
                    log.info("Member validated: {}", memberId);
                    return Mono.empty();
                });
    }

    private Mono<Void> validatePaymentMethod(MakePaymentCommand command) {
        // Validar voucher
        if (command.voucher() == null) {
            return Mono.error(new BadRequestException("Voucher is required for this payment method"));
        }
        if (command.voucher().image() == null) {
            return Mono.error(new BadRequestException("Voucher image is required"));
        }
        return Mono.empty();
    }

    private Mono<Payment> createPayment(MakePaymentCommand command) {
        Payment payment = paymentFactory.createPaymentWithPendingStatus(command);
        return paymentRepositoryPort.save(payment);
    }

    private Mono<Void> saveVoucher(Payment payment, MakePaymentCommand.Voucher voucherCmd) {
        return voucherStorageService.saveVoucher(voucherCmd.image())
                .flatMap(imageUrl -> {
                    PaymentVoucher voucher = paymentVoucherFactory.createPaymentVoucher(
                            voucherCmd, payment.getId(), imageUrl);
                    return paymentVoucherRepositoryPort.save(voucher);
                })
                .then();
    }

    private Mono<Void> updateScheduleStatus(UUID scheduleId, Instant paymentDate) {
        return carPaymentScheduleRepositoryPort.updateSchedulePayment(
                scheduleId,
                PaymentStatus.COMPLETED.getId().intValue(),
                paymentDate
        );
    }

    @Override
    public Mono<PaymentResponseDto> approvePayment(Long paymentId) {
        return Mono.error(new UnsupportedOperationException("Not implemented yet"));
    }

    @Override
    public Mono<PaymentResponseDto> rejectPayment(Long paymentId, String reason, String detail) {
        return Mono.error(new UnsupportedOperationException("Not implemented yet"));
    }
}