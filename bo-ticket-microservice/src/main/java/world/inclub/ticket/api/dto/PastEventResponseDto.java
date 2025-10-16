package world.inclub.ticket.api.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class PastEventResponseDto {
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
    private MediaDetail media;

    @Data
    public static class MediaDetail {
        private Integer mediaId;
        private String imageUrl;
        private String secondImageUrl;
        private String videoUrl;
    }
}