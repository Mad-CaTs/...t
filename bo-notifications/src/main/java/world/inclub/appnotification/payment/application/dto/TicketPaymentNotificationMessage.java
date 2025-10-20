package world.inclub.appnotification.payment.application.dto;

import lombok.Builder;
import world.inclub.appnotification.payment.application.enums.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Builder
public record TicketPaymentNotificationMessage(
        User user,
        Event event,
        Payment payment,
        RejectedPayment rejectedPayment,
        PaymentStatus status
) {
    @Builder
    public record User(
            String email,
            String fullName
    ) {}

    @Builder
    public record Event(
            String name,
            LocalDate eventDate,
            LocalTime startTime,
            String bannerUrl
    ) {}

    @Builder
    public record Payment(
            Long id,
            String method,
            String currencyType,
            Integer ticketQuantity,
            BigDecimal subTotalAmount,
            BigDecimal commissionAmount,
            BigDecimal totalAmount,
            LocalDateTime createdAt
    ) {}

    @Builder
    public record RejectedPayment(
            String reason,
            LocalDateTime rejectedAt
    ) {}
}
