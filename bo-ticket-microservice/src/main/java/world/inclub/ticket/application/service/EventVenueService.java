package world.inclub.ticket.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.EventVenueRequestDto;
import world.inclub.ticket.api.dto.EventVenueResponseDto;
import world.inclub.ticket.application.service.interfaces.*;
import world.inclub.ticket.domain.model.EventVenue;
import world.inclub.ticket.domain.repository.EventVenueRepository;
import world.inclub.ticket.infraestructure.exceptions.NotFoundException;
import world.inclub.ticket.api.mapper.EventVenueMapper;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EventVenueService implements CreateEventVenueUseCase,
        GetAllEventVenueUseCase,
        GetEventVenueUseCase,
        UpdateEventVenueUseCase,
        DeleteEventVenueUseCase {

    private final EventVenueRepository repository;
    private final EventVenueMapper mapper;

    @Override
    public Mono<EventVenueResponseDto> create(EventVenueRequestDto dto, UUID updatedBy) {
        EventVenue domain = mapper.toDomain(dto);
        domain.setCreatedBy(updatedBy);
        return repository.save(domain)
                .map(mapper::toResponseDto);
    }

    @Override
    public Mono<Void> deleteById(Integer id) {
        return repository.findById(id)
                .switchIfEmpty(Mono.error(new NotFoundException("No existe el Lugar con el ID: " + id)))
                .flatMap(venue -> repository.deleteById(id));
    }

    @Override
    public Flux<EventVenueResponseDto> getAll() {
        return repository.findAll()
                .map(mapper::toResponseDto)
                .sort(Comparator.comparing(EventVenueResponseDto::getVenueId));
    }

    @Override
    public Mono<EventVenueResponseDto> getById(Integer id) {
        return repository.findById(id)
                .switchIfEmpty(Mono.error(new NotFoundException("EventVenue con ID " + id + " no encontrado.")))
                .map(mapper::toResponseDto);
    }

    @Override
    public Mono<EventVenueResponseDto> update(Integer id, EventVenueRequestDto dto, UUID updateBy) {
        return repository.findById(id)
                .switchIfEmpty(Mono.error(new NotFoundException("No se encontró el EventVenue con id: " + id)))
                .flatMap(existing -> {
                    existing.setNameVenue(dto.getNameVenue());
                    existing.setCountry(dto.getCountry());
                    existing.setCity(dto.getCity());
                    existing.setAddress(dto.getAddress());
                    existing.setLatitude(dto.getLatitude());
                    existing.setLongitude(dto.getLongitude());
                    existing.setStatus(dto.getStatus());
                    existing.setUpdatedAt(LocalDateTime.now());
                    existing.setUpdatedBy(updateBy);
                    return repository.save(existing);
                }).map(mapper::toResponseDto);
    }
}