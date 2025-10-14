package world.inclub.ticket.api.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class EventZoneResponseDto {
    private Integer eventZoneId;
    private Integer eventId;
    private Integer ticketTypeId;
    private List<ZoneDetail> zones;

    @Data
    public static class ZoneDetail {
        private Integer eventZoneId;
        private Integer seatTypeId;
        private String zoneName;
        private BigDecimal price;
        private BigDecimal priceSoles;
        private Integer capacity;
        private Integer seats;
    }
}