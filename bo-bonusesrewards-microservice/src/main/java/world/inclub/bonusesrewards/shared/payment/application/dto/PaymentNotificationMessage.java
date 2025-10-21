package world.inclub.bonusesrewards.shared.payment.application.dto;

import lombok.Builder;
import lombok.Data;
import world.inclub.bonusesrewards.shared.payment.domain.model.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Builder
public record PaymentNotificationMessage(
        User user,
        Schedule schedule,
        Payment payment,
        Voucher voucher,
        RejectedPayment rejectedPayment,
        PaymentStatus status
) {
    @Builder
    public record User(
            String email,
            String fullName
    ) {}

    @Builder
    public record Schedule(
            Integer installmentNumber
    ) {}

    @Builder
    public record Voucher(
            String operationNumber
    ) {}

    @Builder
    public record Payment(
            UUID id,
            String bonusType,
            String paymentType,
            String paymentSubType,
            String currencyType,
            BigDecimal subTotalAmount,
            BigDecimal commissionAmount,
            BigDecimal totalAmount,
            LocalDateTime createdAt
    ) {}

    @Builder
    public record RejectedPayment(
            String reason,
            String detail,
            LocalDateTime rejectedAt
    ) {}
}
