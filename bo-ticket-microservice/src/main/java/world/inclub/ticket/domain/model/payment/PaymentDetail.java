package world.inclub.ticket.domain.model.payment;

import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
public record PaymentDetail(
        Long id,
        Long paymentId,
        Long itemTypeId,
        Long itemId,
        Integer ticketQuantity,
        BigDecimal unitPrice,
        BigDecimal totalPrice,
        LocalDateTime createdAt
) {}
