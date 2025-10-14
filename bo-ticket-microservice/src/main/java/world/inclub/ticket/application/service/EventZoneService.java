package world.inclub.ticket.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.EventZoneRequestDto;
import world.inclub.ticket.api.dto.EventZoneResponseDto;
import world.inclub.ticket.api.mapper.EventZoneMapper;
import world.inclub.ticket.application.service.interfaces.*;
import world.inclub.ticket.domain.model.EventZone;
import world.inclub.ticket.domain.repository.EventZoneRepository;
import world.inclub.ticket.infraestructure.exceptions.NotFoundException;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventZoneService implements CreateEventZoneUseCase,
        GetAllEventZoneUseCase,
        GetEventZoneUseCase,
        UpdateEventZoneUseCase,
        DeleteEventZoneUseCase {

    private final EventZoneRepository repository;
    private final EventZoneMapper mapper;

    @Override
    public Mono<EventZoneResponseDto> create(EventZoneRequestDto dto) {
        if (dto.getEventId() == null || dto.getTicketTypeId() == null || dto.getZones() == null || dto.getZones().isEmpty() ||
                dto.getZones().stream().anyMatch(zone ->
                        zone.getSeatTypeId() == null || zone.getZoneName() == null ||
                                zone.getPrice() == null || zone.getPriceSoles() == null)) {
            return Mono.error(new IllegalArgumentException("Los campos eventId, ticketTypeId, seatTypeId, zoneName, price y priceSoles son obligatorios"));
        }
        List<EventZone> newZones = mapper.toDomain(dto);
        return Flux.fromIterable(newZones)
                .flatMap(repository::save)
                .collectList()
                .map(mapper::toResponseDto);
    }

    @Override
    public Mono<Void> deleteById(Integer id) {
        return repository.findById(id)
                .switchIfEmpty(Mono.error(new NotFoundException("No existe la zona con el ID: " + id)))
                .flatMap(eventZone -> repository.deleteById(id));
    }

    @Override
    public Flux<EventZoneResponseDto> getAll() {
        return repository.findAll()
                .map(mapper::toResponseDto)
                .sort(Comparator.comparing(EventZoneResponseDto::getEventZoneId));
    }

    @Override
    public Mono<EventZoneResponseDto> getEventZone(Integer id) {
        return repository.findById(id)
                .switchIfEmpty(Mono.error(new NotFoundException("Zona con ID " + id + " no encontrada.")))
                .map(mapper::toResponseDto);
    }

    @Override
    public Mono<EventZoneResponseDto> update(Integer eventId, EventZoneRequestDto dto) {
        return repository.findByEventId(dto.getEventId())
                .switchIfEmpty(Mono.error(new NotFoundException("Couldn't find zones for event ID: " + dto.getEventId())))
                .collectList()
                .flatMap(existingZones -> {
                    Map<Integer, EventZone> existingById = existingZones.stream()
                            .collect(Collectors.toMap(EventZone::getEventZoneId, z -> z));

                    // Validate zones to delete
                    if (dto.getZonesToDelete() != null && !dto.getZonesToDelete().isEmpty()) {
                        boolean allValid = dto.getZonesToDelete().stream()
                                .allMatch(existingById::containsKey);

                        if (!allValid) {
                            return Mono.error(new IllegalArgumentException(
                                    "Some zones to delete do not belong to event " + dto.getEventId()));
                        }
                    }

                    // Process deletions
                    Mono<Void> deleteStep;
                    if (dto.getZonesToDelete() != null && !dto.getZonesToDelete().isEmpty()) {
                        deleteStep = repository.deleteAllByEventZoneIdIn(dto.getZonesToDelete());
                    } else {
                        deleteStep = Mono.empty();
                    }

                    return deleteStep.then(
                            Flux.fromIterable(dto.getZones())
                                    .flatMap(zoneDto -> {
                                        Integer zoneId = zoneDto.getEventZoneId();
                                        if (zoneId == null) {
                                            // INSERT
                                            EventZone newZone = mapper.toDomain(dto, zoneDto);
                                            return repository.save(newZone);
                                        } else {
                                            // UPDATE
                                            EventZone existing = existingById.get(zoneDto.getEventZoneId());
                                            existing.setSeatTypeId(zoneDto.getSeatTypeId());
                                            existing.setZoneName(zoneDto.getZoneName());
                                            existing.setPrice(zoneDto.getPrice());
                                            existing.setPriceSoles(zoneDto.getPriceSoles());
                                            existing.setCapacity(zoneDto.getCapacity());
                                            existing.setSeats(zoneDto.getSeats());
                                            return repository.save(existing);
                                        }
                                    })
                                    .collectList()
                                    .map(mapper::toResponseDto));
                });
    }

    public Mono<EventZoneResponseDto> getByEventId(Integer eventId) {
        return repository.findByEventId(eventId)
                .collectList()
                .flatMap(zones -> {
                    if (zones.isEmpty()) {
                        return Mono.error(new NotFoundException("No se encontraron zonas para el evento con ID: " + eventId));
                    }
                    return Mono.just(mapper.toResponseDto(zones));
                });
    }
}