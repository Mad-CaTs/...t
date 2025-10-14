package world.inclub.ticket.infraestructure.persistence.mapper.ticket_package;

import org.springframework.stereotype.Component;
import world.inclub.ticket.domain.model.ticket_package.TicketPackage;
import world.inclub.ticket.infraestructure.persistence.entity.ticket_package.TicketPackageEntity;

@Component
public class TicketPackageMapper {
    public static TicketPackage toDomain(TicketPackageEntity entity) {
        if (entity == null) return null;

        TicketPackage domain = new TicketPackage();
        domain.setId(entity.getTicketPackageId());
        domain.setEventId(entity.getEventId());
        domain.setName(entity.getName());
        domain.setDescription(entity.getDescription());
        domain.setCurrencyTypeId(entity.getCurrencyTypeId());
        domain.setPricePen(entity.getPricePen());
        domain.setPriceUsd(entity.getPriceUsd());
        domain.setStatusId(entity.getStatusId());
        domain.setCreatedAt(entity.getCreatedAt());
        domain.setExpirationDate(entity.getExpirationDate());
        domain.setUpdatedAt(entity.getUpdatedAt());
        return domain;
    }

    public static TicketPackageEntity toEntity(TicketPackage domain) {
        if (domain == null) return null;

        TicketPackageEntity entity = new TicketPackageEntity();
        entity.setTicketPackageId(domain.getId());
        entity.setEventId(domain.getEventId());
        entity.setName(domain.getName());
        entity.setDescription(domain.getDescription());
        entity.setCurrencyTypeId(domain.getCurrencyTypeId());
        entity.setPricePen(domain.getPricePen());
        entity.setPriceUsd(domain.getPriceUsd());
        entity.setStatusId(domain.getStatusId());
        entity.setCreatedAt(domain.getCreatedAt());
        entity.setExpirationDate(domain.getExpirationDate());
        entity.setUpdatedAt(domain.getUpdatedAt());
        return entity;
    }
}