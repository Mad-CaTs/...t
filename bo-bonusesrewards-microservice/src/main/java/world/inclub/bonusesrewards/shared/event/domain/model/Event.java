package world.inclub.bonusesrewards.shared.event.domain.model;

import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalTime;

@Builder
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
) {
    public static Event empty() {
        return Event.builder()
                .id(0L)
                .name("Unknown Event")
                .isMainEvent(false)
                .ticketTypeId(0L)
                .eventTypeId(0L)
                .eventDate(null)
                .startTime(null)
                .endTime(null)
                .venueId(0L)
                .eventUrl("")
                .statusEvent("")
                .description("")
                .flyerUrl("")
                .presenter("")
                .build();
    }
}