package world.inclub.ticket.api.mapper;

import org.springframework.stereotype.Component;
import world.inclub.ticket.domain.model.EventMedia;
import world.inclub.ticket.domain.entity.EventMediaEntity;

@Component
public class EventMediaMapper {

    public EventMedia toDomain(EventMediaEntity entity) {
        if (entity == null) {
            return null;
        }
        return EventMedia.builder()
                .mediaId(entity.getMediaId())
                .eventId(entity.getEventId())
                .imageUrl(entity.getImageUrl())
                .secondImageUrl(entity.getSecondImageUrl())
                .videoUrl(entity.getVideoUrl())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public EventMediaEntity toEntity(EventMedia domain) {
        if (domain == null) {
            return null;
        }
        return EventMediaEntity.builder()
                .mediaId(domain.getMediaId())
                .eventId(domain.getEventId())
                .imageUrl(domain.getImageUrl())
                .secondImageUrl(domain.getSecondImageUrl())
                .videoUrl(domain.getVideoUrl())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .build();
    }
}