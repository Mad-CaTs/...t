package world.inclub.ticket.infraestructure.controller.dto;

import world.inclub.ticket.domain.enums.TicketStatus;

import java.util.UUID;

public record UpdateQrRequest(
        UUID ticketUuid,
        TicketStatus status
) {
}
