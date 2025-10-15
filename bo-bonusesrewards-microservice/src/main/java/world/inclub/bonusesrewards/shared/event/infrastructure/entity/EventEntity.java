package world.inclub.bonusesrewards.shared.event.infrastructure.entity;

import java.time.LocalDate;
import java.time.LocalTime;

public record EventEntity(
        Long eventId,
        String eventName,
        Boolean isMainEvent,
        Long ticketTypeId,
        Long eventTypeId,
        LocalDate eventDate,
        LocalTime startDate,
        LocalTime endDate,
        Long venueId,
        String eventUrl,
        String statusEvent,
        String description,
        String flyerUrl,
        String presenter
) {}