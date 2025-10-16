package world.inclub.ticket.infraestructure.persistence.mapper.ticket_package;

import org.springframework.stereotype.Component;
import world.inclub.ticket.domain.model.ticket_package.EventPackageItem;
import world.inclub.ticket.infraestructure.persistence.entity.ticket_package.EventPackageItemEntity;

@Component
public class EventPackageItemMapper {
    public static EventPackageItem toDomain(EventPackageItemEntity entity) {
        if (entity == null) return null;

        EventPackageItem domain = new EventPackageItem();
        domain.setId(entity.getEventPackageItemId());
        domain.setTicketPackageId(entity.getTicketPackageId());
        domain.setEventZoneId(entity.getEventZoneId());
        domain.setQuantity(entity.getQuantity());
        domain.setQuantityFree(entity.getQuantityFree());
        return domain;
    }

    public static EventPackageItemEntity toEntity(EventPackageItem domain) {
        if (domain == null) return null;

        EventPackageItemEntity entity = new EventPackageItemEntity();
        entity.setEventPackageItemId(domain.getId());
        entity.setTicketPackageId(domain.getTicketPackageId());
        entity.setEventZoneId(domain.getEventZoneId());
        entity.setQuantity(domain.getQuantity());
        entity.setQuantityFree(domain.getQuantityFree());
        return entity;
    }
}
