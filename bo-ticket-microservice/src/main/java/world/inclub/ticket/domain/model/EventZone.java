package world.inclub.ticket.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventZone {
    private Integer eventZoneId;
    private Integer eventId;
    private Integer ticketTypeId;
    private Integer seatTypeId;
    private String zoneName;
    private BigDecimal price;
    private BigDecimal priceSoles;
    private Integer capacity;
    private Integer seats;
}