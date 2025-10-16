package world.inclub.ticket.application.dto;

import java.util.List;
import java.util.UUID;

public record UpdateAttendeesCommand(
        Long paymentId,
        List<Attendee> attendees
) {
    public record Attendee(
            UUID ticketUuid,
            Long documentTypeId,
            String documentNumber,
            String email,
            String name,
            String lastName
    ) {}
}
