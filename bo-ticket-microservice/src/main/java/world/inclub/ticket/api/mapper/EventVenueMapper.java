package world.inclub.ticket.api.mapper;

import org.springframework.stereotype.Component;
import world.inclub.ticket.api.dto.EventVenueRequestDto;
import world.inclub.ticket.api.dto.EventVenueResponseDto;
import world.inclub.ticket.domain.model.EventVenue;
import world.inclub.ticket.domain.entity.EventVenueEntity;

@Component
public class EventVenueMapper {
    public EventVenue toDomain(EventVenueEntity entity) {
        if (entity == null) return null;
        return EventVenue.builder()
                .venueId(entity.getVenueId())
                .nameVenue(entity.getNameVenue())
                .country(entity.getCountry())
                .city(entity.getCity())
                .address(entity.getAddress())
                .latitude(entity.getLatitude())
                .longitude(entity.getLongitude())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .updatedBy(entity.getUpdatedBy())
                .build();
    }

    public EventVenueEntity toEntity(EventVenue domain) {
        if (domain == null) return null;
        return EventVenueEntity.builder()
                .venueId(domain.getVenueId())
                .nameVenue(domain.getNameVenue())
                .country(domain.getCountry())
                .city(domain.getCity())
                .address(domain.getAddress())
                .latitude(domain.getLatitude())
                .longitude(domain.getLongitude())
                .status(domain.getStatus())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .createdBy(domain.getCreatedBy())
                .updatedBy(domain.getUpdatedBy())
                .build();
    }

    public EventVenue toDomain(EventVenueRequestDto dto) {
        if (dto == null) return null;
        return EventVenue.builder()
                .nameVenue(dto.getNameVenue())
                .country(dto.getCountry())
                .city(dto.getCity())
                .address(dto.getAddress())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .status(dto.getStatus())
                .build();
    }

    public EventVenueResponseDto toResponseDto(EventVenue domain) {
        if (domain == null) return null;
        EventVenueResponseDto response = new EventVenueResponseDto();
        response.setVenueId(domain.getVenueId());
        response.setNameVenue(domain.getNameVenue());
        response.setCountry(domain.getCountry());
        response.setCity(domain.getCity());
        response.setAddress(domain.getAddress());
        response.setLatitude(domain.getLatitude());
        response.setLongitude(domain.getLongitude());
        response.setStatus(domain.getStatus());
        return response;
    }
}