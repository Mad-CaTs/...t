package world.inclub.ticket.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table("Event")
public class EventEntity {
    @Id
    @Column("EventId")
    private Integer eventId;

    @Column("EventName")
    private String eventName;

    @Column("EventDate")
    private LocalDate eventDate;

    @Column("StartDate")
    private LocalTime startDate;

    @Column("EndDate")
    private LocalTime endDate;

    @Column("EventUrl")
    private String eventUrl;

    @Column("Description")
    private String description;

    @Column("IsMainEvent")
    private Boolean isMainEvent;

    @Column("FlyerUrl")
    private String flyerUrl;

    @Column("Presenter")
    private String presenter;

    @Column("EventTypeId")
    private Integer eventTypeId;

    @Column("TicketTypeId")
    private Integer ticketTypeId;

    @Column("VenueId")
    private Integer venueId;

    @Column("CreatedAt")
    private LocalDateTime createdAt;

    @Column("UpdatedAt")
    private LocalDateTime updatedAt;

    @Column("CreatedBy")
    private UUID createdBy;

    @Column("UpdatedBy")
    private UUID updatedBy;

    @Column("StatusEvent")
    private String statusEvent;
}