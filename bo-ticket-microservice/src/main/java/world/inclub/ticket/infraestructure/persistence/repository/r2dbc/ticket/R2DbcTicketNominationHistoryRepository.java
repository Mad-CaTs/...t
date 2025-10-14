package world.inclub.ticket.infraestructure.persistence.repository.r2dbc.ticket;

import org.springframework.data.r2dbc.repository.R2dbcRepository;
import world.inclub.ticket.infraestructure.persistence.entity.ticket.TicketNominationHistoryEntity;

public interface R2DbcTicketNominationHistoryRepository extends R2dbcRepository<TicketNominationHistoryEntity, Long> {}