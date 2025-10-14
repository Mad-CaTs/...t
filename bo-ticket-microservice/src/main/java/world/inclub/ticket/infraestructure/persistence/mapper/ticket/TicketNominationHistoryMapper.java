package world.inclub.ticket.infraestructure.persistence.mapper.ticket;

import org.springframework.stereotype.Component;
import world.inclub.ticket.infraestructure.persistence.entity.ticket.TicketNominationHistoryEntity;
import world.inclub.ticket.domain.model.ticket.TicketNominationHistory;

@Component
public class TicketNominationHistoryMapper {

    public TicketNominationHistory toDomain(TicketNominationHistoryEntity entity) {
        return new TicketNominationHistory(
                entity.getId(),
                entity.getTicketId(),
                entity.getOldStatusId(),
                entity.getNewStatusId(),
                entity.getNote(),
                entity.getCreatedBy(),
                entity.getCreatedAt()
        );
    }

    public TicketNominationHistoryEntity toEntity(TicketNominationHistory model) {
        return new TicketNominationHistoryEntity(
                model.id(),
                model.ticketId(),
                model.oldStatusId(),
                model.newStatusId(),
                model.note(),
                model.createdBy(),
                model.createdAt()
        );
    }

}
