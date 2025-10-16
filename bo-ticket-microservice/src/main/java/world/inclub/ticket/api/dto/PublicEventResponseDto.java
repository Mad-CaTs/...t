package world.inclub.ticket.api.dto;

import lombok.Data;

@Data
public class PublicEventResponseDto {
    private Integer eventId;
    private String eventName;
    private EventTypeDetail eventType;
    private String description;
    private String flyerUrl;
    private MediaDetail media;

    @Data
    public static class EventTypeDetail {
        private Integer eventTypeId;
        private String eventTypeName;
    }

    @Data
    public static class MediaDetail {
        private Integer mediaId;
        private String imageUrl;
        private String secondImageUrl;
        private String videoUrl;
    }
}