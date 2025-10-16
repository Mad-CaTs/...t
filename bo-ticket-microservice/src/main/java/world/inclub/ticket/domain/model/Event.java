package world.inclub.ticket.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Event {
    private Integer eventId;
    private String eventName;
    private Boolean isMainEvent;
    private Integer ticketTypeId;
    private Integer eventTypeId;
    private LocalDate eventDate;
    private LocalTime startDate;
    private LocalTime endDate;
    private Integer venueId;
    private String eventUrl;
    private String statusEvent;
    private String description;
    private String flyerUrl;
    private String presenter;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UUID createdBy;
    private UUID updatedBy;
}