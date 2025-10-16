package world.inclub.ticket.application.dto;

import lombok.Builder;
import world.inclub.ticket.application.enums.PaymentNominationStatusEnum;

import java.time.LocalDateTime;

@Builder
public record NominationStatusResponse(
        Long paymentId,
        String orderNumber,
        LocalDateTime paymentDate,
        String eventName,
        Integer totalTickets,
        PaymentNominationStatusEnum status
) {}
