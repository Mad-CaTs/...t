package world.inclub.ticket.api.mapper;

import org.springframework.stereotype.Component;
import world.inclub.ticket.api.dto.EventZoneRequestDto;
import world.inclub.ticket.api.dto.EventZoneResponseDto;
import world.inclub.ticket.domain.model.EventZone;
import world.inclub.ticket.domain.entity.EventZoneEntity;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class EventZoneMapper {
    public EventZone toDomain(EventZoneEntity entity) {
        if (entity == null) return null;

        return EventZone.builder()
                .eventZoneId(entity.getEventZoneId())
                .eventId(entity.getEventId())
                .ticketTypeId(entity.getTicketTypeId())
                .seatTypeId(entity.getSeatTypeId())
                .zoneName(entity.getZoneName())
                .price(entity.getPrice())
                .priceSoles(entity.getPriceSoles())
                .capacity(entity.getCapacity())
                .seats(entity.getSeats())
                .build();
    }

    public EventZoneEntity toEntity(EventZone domain) {
        if (domain == null) return null;

        return EventZoneEntity.builder()
                .eventZoneId(domain.getEventZoneId())
                .eventId(domain.getEventId())
                .ticketTypeId(domain.getTicketTypeId())
                .seatTypeId(domain.getSeatTypeId())
                .zoneName(domain.getZoneName())
                .price(domain.getPrice())
                .priceSoles(domain.getPriceSoles())
                .capacity(domain.getCapacity())
                .seats(domain.getSeats())
                .build();
    }

    public EventZone toDomain(EventZoneRequestDto dto, EventZoneRequestDto.ZoneDetail zoneDetail) {
        return EventZone.builder()
                .eventId(dto.getEventId())
                .ticketTypeId(dto.getTicketTypeId())
                .seatTypeId(zoneDetail.getSeatTypeId())
                .zoneName(zoneDetail.getZoneName())
                .price(zoneDetail.getPrice())
                .priceSoles(zoneDetail.getPriceSoles())
                .capacity(zoneDetail.getCapacity())
                .seats(zoneDetail.getSeats())
                .build();
    }


    public List<EventZone> toDomain(EventZoneRequestDto dto) {
        if (dto == null || dto.getZones() == null) return List.of();

        return dto.getZones().stream().map(zone -> EventZone.builder()
                .eventId(dto.getEventId())
                .ticketTypeId(dto.getTicketTypeId())
                .seatTypeId(zone.getSeatTypeId())
                .zoneName(zone.getZoneName())
                .price(zone.getPrice())
                .priceSoles(zone.getPriceSoles())
                .capacity(zone.getCapacity())
                .seats(zone.getSeats())
                .build()).collect(Collectors.toList());
    }

    public EventZoneResponseDto toResponseDto(EventZone domain) {
        if (domain == null) return null;
        EventZoneResponseDto response = new EventZoneResponseDto();
        response.setEventZoneId(domain.getEventZoneId());
        response.setEventId(domain.getEventId());
        response.setTicketTypeId(domain.getTicketTypeId());
        EventZoneResponseDto.ZoneDetail zoneDetail = new EventZoneResponseDto.ZoneDetail();
        zoneDetail.setSeatTypeId(domain.getSeatTypeId());
        zoneDetail.setZoneName(domain.getZoneName());
        zoneDetail.setPrice(domain.getPrice());
        zoneDetail.setPriceSoles(domain.getPriceSoles());
        zoneDetail.setCapacity(domain.getCapacity());
        zoneDetail.setSeats(domain.getSeats());
        response.setZones(List.of(zoneDetail));
        return response;
    }

    public EventZoneResponseDto toResponseDto(List<EventZone> domains) {
        if (domains == null || domains.isEmpty()) return new EventZoneResponseDto();
        EventZoneResponseDto response = new EventZoneResponseDto();
        response.setEventZoneId(domains.get(0).getEventZoneId());
        response.setEventId(domains.get(0).getEventId());
        response.setTicketTypeId(domains.get(0).getTicketTypeId());
        List<EventZoneResponseDto.ZoneDetail> zoneDetails = domains.stream().map(domain -> {
            EventZoneResponseDto.ZoneDetail zoneDetail = new EventZoneResponseDto.ZoneDetail();
            zoneDetail.setEventZoneId(domain.getEventZoneId());
            zoneDetail.setSeatTypeId(domain.getSeatTypeId());
            zoneDetail.setZoneName(domain.getZoneName());
            zoneDetail.setPrice(domain.getPrice());
            zoneDetail.setPriceSoles(domain.getPriceSoles());
            zoneDetail.setCapacity(domain.getCapacity());
            zoneDetail.setSeats(domain.getSeats());
            return zoneDetail;
        }).collect(Collectors.toList());
        response.setZones(zoneDetails);
        return response;
    }
}