package world.inclub.ticket.application.dto;

import lombok.Builder;
import world.inclub.ticket.domain.enums.TicketStatus;

import java.util.UUID;


@Builder
public record TicketQrPayload(
        UUID ticketUuid,
        String eventName,
        String zoneName,
        TicketStatus status,
        Attendee attendee
) {
    @Builder
    public record Attendee(
            String name,
            String lastName,
            String documentType,
            String documentNumber
    ) {}
}
