package world.inclub.ticket.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("event_zone")
public class EventZoneEntity {

    @Id
    @Column("eventzoneid")
    private Integer eventZoneId;

    @Column("eventid")
    private Integer eventId;

    @Column("tickettypeid")
    private Integer ticketTypeId;

    @Column("seattypeid")
    private Integer seatTypeId;

    @Column("zonename")
    private String zoneName;

    @Column("price")
    private BigDecimal price;

    @Column("priceSoles")
    private BigDecimal priceSoles;

    @Column("capacity")
    private Integer capacity;

    @Column("seats")
    private Integer seats;
}