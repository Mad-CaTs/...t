package world.inclub.ticket.infraestructure.controller.dto;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record UserPurchaseResponse(
        String orderNumber,
        LocalDateTime purchaseDate,
        String eventName,
        String paymentMethod,
        String total,
        String status
) {}
