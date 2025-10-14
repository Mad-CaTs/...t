package world.inclub.ticket.infraestructure.controller.dto;

import lombok.Builder;
import world.inclub.ticket.domain.model.ticket.TicketNominationStatus;

import java.time.LocalDate;
import java.util.UUID;

@Builder
public record UserTicketDetailsResponse(
        Long paymentId,
        String orderNumber,
        LocalDate purchaseDate,
        String eventName,
        LocalDate eventDate,
        LocalDate validDate,
        UUID ticketUuid,
        String zoneName,
        TicketNominationStatus status,
        String pdfUrl,
        AttendeeResponse attendee
) {
    @Builder
    public record AttendeeResponse(
            Long documentTypeId,
            String documentNumber,
            String name,
            String lastName,
            String email
    ) {}
}
