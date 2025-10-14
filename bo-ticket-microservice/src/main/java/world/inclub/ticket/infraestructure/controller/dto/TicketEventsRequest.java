package world.inclub.ticket.infraestructure.controller.dto;

import jakarta.validation.constraints.NotNull;
import world.inclub.ticket.domain.enums.TicketStatus;

public record TicketEventsRequest(

        @NotNull
        Long eventId,

        @NotNull
        TicketStatus status,

        @NotNull
        PaginationRequest pagination

) {
}
