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
        Payment payment,
        RejectedPayment rejectedPayment,
        PaymentStatus status
) {
    @Builder
    public record Payment(
            UUID id,
            String bonusType,
            String paymentType,
            String currencyType,
            BigDecimal subTotalAmount,
            BigDecimal commissionAmount,
            BigDecimal totalAmount,
            LocalDateTime createdAt
    ) {}

    @Builder
    public record User(
            String email,
            String fullName
    ) {}

    @Builder
    public record RejectedPayment(
            String reason,
            LocalDateTime rejectedAt
    ) {}
}
