package world.inclub.ticket.application.dto;

import lombok.Builder;
import world.inclub.ticket.domain.enums.TicketStatus;

import java.util.UUID;

@Builder
public record TicketWithAttendeeResponse(
        UUID ticketUuid,
        TicketStatus status,
        Attendee attendee
) {
    @Builder
    public record Attendee(
            String name,
            String lastName
    ) {
    }

}
