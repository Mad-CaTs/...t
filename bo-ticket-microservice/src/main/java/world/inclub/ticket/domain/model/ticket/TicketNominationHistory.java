package world.inclub.ticket.domain.model.ticket;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record TicketNominationHistory(
    Long id,
    Long ticketId,
    Long oldStatusId,
    Long newStatusId,
    String note,
    Long createdBy,
    LocalDateTime createdAt
) {}
