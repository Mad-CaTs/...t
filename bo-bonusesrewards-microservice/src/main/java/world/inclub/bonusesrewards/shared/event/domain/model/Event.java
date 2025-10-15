package world.inclub.bonusesrewards.shared.event.domain.model;

import java.time.LocalDate;
import java.time.LocalTime;

public record Event(
        Long id,
        String name,
        Boolean isMainEvent,
        Long ticketTypeId,
        Long eventTypeId,
        LocalDate eventDate,
        LocalTime startTime,
        LocalTime endTime,
        Long venueId,
        String eventUrl,
        String statusEvent,
        String description,
        String flyerUrl,
        String presenter
) {}