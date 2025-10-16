package world.inclub.ticket.infraestructure.persistence.mapper.ticket_package;

import org.springframework.stereotype.Component;
import world.inclub.ticket.domain.model.ticket_package.TicketPackageHistory;
import world.inclub.ticket.infraestructure.persistence.entity.ticket_package.TicketPackageHistoryEntity;

@Component
public class TicketPackageHistoryMapper {
    public static TicketPackageHistory toDomain(TicketPackageHistoryEntity entity) {
        if (entity == null) return null;

        TicketPackageHistory domain = new TicketPackageHistory();
        domain.setId(entity.getHistoryId());
        domain.setTicketPackageId(entity.getTicketPackageId());
        domain.setAction(entity.getAction());
        domain.setOldValue(entity.getOldValue());
        domain.setNewValue(entity.getNewValue());
        domain.setChangedAt(entity.getChangedAt());
        domain.setChangedBy(entity.getChangedBy());
        return domain;
    }

    public static TicketPackageHistoryEntity toEntity(TicketPackageHistory domain) {
        if (domain == null) return null;

        TicketPackageHistoryEntity entity = new TicketPackageHistoryEntity();
        entity.setHistoryId(domain.getId());
        entity.setTicketPackageId(domain.getTicketPackageId());
        entity.setAction(domain.getAction());
        entity.setOldValue(domain.getOldValue());
        entity.setNewValue(domain.getNewValue());
        entity.setChangedAt(domain.getChangedAt());
        entity.setChangedBy(domain.getChangedBy());
        return entity;
    }
}