package world.inclub.ticket.api.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class PublicEventWithZonesResponseDto {
    private Integer eventId;
    private String eventName;
    private EventTypeDetail eventType;
    private LocalDate eventDate;
    private LocalTime startDate;
    private LocalTime endDate;
    private VenueDetail venue;
    private String flyerUrl;
    private List<ZoneDetail> zones;
    private Boolean isMainEvent;

    @Data
    public static class EventTypeDetail {
        private Integer eventTypeId;
        private String eventTypeName;
    }

    @Data
    public static class VenueDetail {
        private Integer venueId;
        private String nameVenue;
        private String country;
        private String city;
        private String address;
        private String latitude;
        private String longitude;
    }

    @Data
    public static class ZoneDetail {
        private Long eventZoneId;
        private String zoneName;
        private BigDecimal price;
        private BigDecimal priceSoles;
        private Integer capacity;
    }
}