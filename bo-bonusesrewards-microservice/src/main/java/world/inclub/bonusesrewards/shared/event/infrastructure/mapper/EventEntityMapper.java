package world.inclub.bonusesrewards.shared.event.infrastructure.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.event.domain.model.Event;
import world.inclub.bonusesrewards.shared.event.infrastructure.entity.EventEntity;

@Component
public class EventEntityMapper {

    public Event toDomain(EventEntity entity) {
        return new Event(
                entity.eventId(),
                entity.eventName(),
                entity.isMainEvent(),
                entity.ticketTypeId(),
                entity.eventTypeId(),
                entity.eventDate(),
                entity.startDate(),
                entity.endDate(),
                entity.venueId(),
                entity.eventUrl(),
                entity.statusEvent(),
                entity.description(),
                entity.flyerUrl(),
                entity.presenter()
        );
    }

}