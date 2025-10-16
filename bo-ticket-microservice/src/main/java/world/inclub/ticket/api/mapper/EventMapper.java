package world.inclub.ticket.api.mapper;

import org.springframework.stereotype.Component;
import world.inclub.ticket.api.dto.EventRequestDto;
import world.inclub.ticket.api.dto.EventResponseDto;
import world.inclub.ticket.api.dto.PastEventResponseDto;
import world.inclub.ticket.api.dto.PublicEventResponseDto;
import world.inclub.ticket.api.dto.PublicEventWithZonesResponseDto;
import world.inclub.ticket.domain.model.Event;
import world.inclub.ticket.domain.entity.EventEntity;
import world.inclub.ticket.domain.model.EventType;
import world.inclub.ticket.domain.model.EventVenue;
import world.inclub.ticket.domain.model.EventZone;
import world.inclub.ticket.domain.model.EventMedia;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class EventMapper {

    public Event toDomain(EventEntity entity) {
        if (entity == null) return null;
        return Event.builder()
                .eventId(entity.getEventId())
                .eventName(entity.getEventName())
                .eventDate(entity.getEventDate())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .eventUrl(entity.getEventUrl())
                .description(entity.getDescription())
                .isMainEvent(entity.getIsMainEvent())
                .flyerUrl(entity.getFlyerUrl())
                .presenter(entity.getPresenter())
                .eventTypeId(entity.getEventTypeId())
                .ticketTypeId(entity.getTicketTypeId())
                .venueId(entity.getVenueId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .updatedBy(entity.getUpdatedBy())
                .statusEvent(entity.getStatusEvent())
                .build();
    }

    public EventEntity toEntity(Event domain) {
        if (domain == null) return null;
        return EventEntity.builder()
                .eventId(domain.getEventId())
                .eventName(domain.getEventName())
                .eventDate(domain.getEventDate())
                .startDate(domain.getStartDate())
                .endDate(domain.getEndDate())
                .eventUrl(domain.getEventUrl())
                .description(domain.getDescription())
                .isMainEvent(domain.getIsMainEvent())
                .flyerUrl(domain.getFlyerUrl())
                .presenter(domain.getPresenter())
                .eventTypeId(domain.getEventTypeId())
                .ticketTypeId(domain.getTicketTypeId())
                .venueId(domain.getVenueId())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .createdBy(domain.getCreatedBy())
                .updatedBy(domain.getUpdatedBy())
                .statusEvent(domain.getStatusEvent())
                .build();
    }

    public Event toDomain(EventRequestDto dto) {
        if (dto == null) return null;
        return Event.builder()
                .eventName(dto.getEventName())
                .eventDate(dto.getEventDate())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .eventUrl(dto.getEventUrl())
                .description(dto.getDescription())
                .isMainEvent(dto.getIsMainEvent())
                .presenter(dto.getPresenter())
                .statusEvent(dto.getStatusEvent())
                .eventTypeId(dto.getEventTypeId())
                .ticketTypeId(dto.getTicketTypeId())
                .venueId(dto.getVenueId())
                .flyerUrl(dto.getFlyerFile() != null ? "" : null)
                .build();
    }

    public EventResponseDto toResponseDto(Event domain, EventMedia media) {
        if (domain == null) return null;
        EventResponseDto response = new EventResponseDto();
        response.setEventId(domain.getEventId());
        response.setEventName(domain.getEventName());
        response.setEventTypeId(domain.getEventTypeId());
        response.setTicketTypeId(domain.getTicketTypeId());
        response.setEventDate(domain.getEventDate());
        response.setStartDate(domain.getStartDate());
        response.setEndDate(domain.getEndDate());
        response.setVenueId(domain.getVenueId());
        response.setEventUrl(domain.getEventUrl());
        response.setDescription(domain.getDescription());
        response.setIsMainEvent(domain.getIsMainEvent());
        response.setFlyerUrl(domain.getFlyerUrl());
        response.setPresenter(domain.getPresenter());
        response.setStatusEvent(domain.getStatusEvent());
        if (media != null && (media.getImageUrl() != null || media.getSecondImageUrl() != null || media.getVideoUrl() != null)) {
            EventResponseDto.MediaDetail mediaDetail = new EventResponseDto.MediaDetail();
            mediaDetail.setMediaId(media.getMediaId());
            mediaDetail.setImageUrl(media.getImageUrl());
            mediaDetail.setSecondImageUrl(media.getSecondImageUrl());
            mediaDetail.setVideoUrl(media.getVideoUrl());
            response.setMedia(mediaDetail);
        } else {
            response.setMedia(null);
        }
        return response;
    }

    public PastEventResponseDto toPastResponseDto(Event domain, EventMedia media) {
        if (domain == null) return null;
        PastEventResponseDto response = new PastEventResponseDto();
        response.setEventId(domain.getEventId());
        response.setEventName(domain.getEventName());
        response.setIsMainEvent(domain.getIsMainEvent());
        response.setTicketTypeId(domain.getTicketTypeId());
        response.setEventTypeId(domain.getEventTypeId());
        response.setEventDate(domain.getEventDate());
        response.setStartDate(domain.getStartDate());
        response.setEndDate(domain.getEndDate());
        response.setVenueId(domain.getVenueId());
        response.setEventUrl(domain.getEventUrl());
        response.setStatusEvent(domain.getStatusEvent());
        response.setDescription(domain.getDescription());
        response.setFlyerUrl(domain.getFlyerUrl());
        response.setPresenter(domain.getPresenter());
        if (media != null && (media.getImageUrl() != null || media.getSecondImageUrl() != null || media.getVideoUrl() != null)) {
            PastEventResponseDto.MediaDetail mediaDetail = new PastEventResponseDto.MediaDetail();
            mediaDetail.setMediaId(media.getMediaId());
            mediaDetail.setImageUrl(media.getImageUrl());
            mediaDetail.setSecondImageUrl(media.getSecondImageUrl());
            mediaDetail.setVideoUrl(media.getVideoUrl());
            response.setMedia(mediaDetail);
        } else {
            response.setMedia(null);
        }
        return response;
    }

    public PublicEventResponseDto toPublicResponseDto(Event domain, EventType eventType, EventMedia media) {
        if (domain == null) return null;
        PublicEventResponseDto response = new PublicEventResponseDto();
        response.setEventId(domain.getEventId());
        response.setEventName(domain.getEventName());
        PublicEventResponseDto.EventTypeDetail eventTypeDetail = new PublicEventResponseDto.EventTypeDetail();
        eventTypeDetail.setEventTypeId(domain.getEventTypeId());
        eventTypeDetail.setEventTypeName(eventType != null ? eventType.getEventTypeName() : "");
        response.setEventType(eventTypeDetail);
        response.setDescription(domain.getDescription());
        response.setFlyerUrl(domain.getFlyerUrl());
        if (media != null && (media.getImageUrl() != null || media.getSecondImageUrl() != null || media.getVideoUrl() != null)) {
            PublicEventResponseDto.MediaDetail mediaDetail = new PublicEventResponseDto.MediaDetail();
            mediaDetail.setMediaId(media.getMediaId());
            mediaDetail.setImageUrl(media.getImageUrl());
            mediaDetail.setSecondImageUrl(media.getSecondImageUrl());
            mediaDetail.setVideoUrl(media.getVideoUrl());
            response.setMedia(mediaDetail);
        } else {
            response.setMedia(null);
        }
        return response;
    }

    public PublicEventWithZonesResponseDto toPublicWithZonesResponseDto(Event domain, List<EventZone> zones, EventType eventType, EventVenue venue) {
        if (domain == null) return null;
        PublicEventWithZonesResponseDto response = new PublicEventWithZonesResponseDto();
        response.setEventId(domain.getEventId());
        response.setEventName(domain.getEventName());
        response.setEventDate(domain.getEventDate());
        response.setStartDate(domain.getStartDate());
        response.setEndDate(domain.getEndDate());
        response.setIsMainEvent(domain.getIsMainEvent());
        PublicEventWithZonesResponseDto.EventTypeDetail eventTypeDetail = new PublicEventWithZonesResponseDto.EventTypeDetail();
        eventTypeDetail.setEventTypeId(domain.getEventTypeId());
        eventTypeDetail.setEventTypeName(eventType != null ? eventType.getEventTypeName() : "");
        response.setEventType(eventTypeDetail);
        PublicEventWithZonesResponseDto.VenueDetail venueDetail = new PublicEventWithZonesResponseDto.VenueDetail();
        venueDetail.setVenueId(venue != null ? venue.getVenueId() : null);
        venueDetail.setNameVenue(venue != null ? venue.getNameVenue() : "");
        venueDetail.setCountry(venue != null ? venue.getCountry() : "");
        venueDetail.setCity(venue != null ? venue.getCity() : "");
        venueDetail.setAddress(venue != null ? venue.getAddress() : "");
        venueDetail.setLatitude(venue != null ? venue.getLatitude() : "");
        venueDetail.setLongitude(venue != null ? venue.getLongitude() : "");
        response.setVenue(venueDetail);
        response.setFlyerUrl(domain.getFlyerUrl());
        if (zones != null) {
            List<PublicEventWithZonesResponseDto.ZoneDetail> zoneDetails = zones.stream()
                    .map(zone -> {
                        PublicEventWithZonesResponseDto.ZoneDetail zoneDetail = new PublicEventWithZonesResponseDto.ZoneDetail();
                        zoneDetail.setEventZoneId(zone.getEventZoneId().longValue());
                        zoneDetail.setZoneName(zone.getZoneName());
                        zoneDetail.setPrice(zone.getPrice());
                        zoneDetail.setPriceSoles(zone.getPriceSoles());
                        zoneDetail.setCapacity(zone.getCapacity());
                        return zoneDetail;
                    })
                    .collect(Collectors.toList());
            response.setZones(zoneDetails);
        }
        return response;
    }
}