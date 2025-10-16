package world.inclub.ticket.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.EventTypeRequestDto;
import world.inclub.ticket.api.dto.EventTypeResponseDto;
import world.inclub.ticket.application.service.interfaces.*;
import world.inclub.ticket.domain.model.EventType;
import world.inclub.ticket.domain.repository.EventTypeRepository;
import world.inclub.ticket.infraestructure.exceptions.NotFoundException;
import world.inclub.ticket.api.mapper.EventTypeMapper;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.UUID;

/**
 * Servicio que implementa los casos de uso para la gestión de tipos de eventos.
 *
 * Implementa todos los contratos definidos para los casos de uso relacionados con EventType,
 * asegurando el cumplimiento de la lógica de negocio y la auditoría.
 */
@Service
@RequiredArgsConstructor
public class EventTypeService implements CreateEventTypeUseCase,
        GetAllEventTypesUseCase,
        GetEventTypeByIdUseCase,
        UpdateEventTypeUseCase,
        DeleteEventTypeUseCase {

    private final EventTypeRepository eventTypeRepository;
    private final EventTypeMapper mapper;

    /**
     * Crea un nuevo tipo de evento con auditoría.
     *
     * @param requestDto DTO con los datos de creación
     * @param userId     UUID del usuario creador para auditoría
     * @return Mono con DTO de respuesta del tipo de evento creado
     */
    @Override
    public Mono<EventTypeResponseDto> create(EventTypeRequestDto requestDto, UUID userId) {
        EventType domain = mapper.toDomain(requestDto);
        domain.setCreatedBy(userId);
        return eventTypeRepository.save(domain)
                .map(mapper::toResponseDto);
    }

    /**
     * Obtiene todos los tipos de eventos.
     *
     * @return Flux con DTOs de todos los tipos de eventos registrados
     */
    @Override
    public Flux<EventTypeResponseDto> getAll() {
        return eventTypeRepository.findAll()
                .map(mapper::toResponseDto)
                .sort(Comparator.comparing(EventTypeResponseDto::getEventTypeId));
    }

    /**
     * Obtiene un tipo de evento por su ID.
     *
     * @param id ID del tipo de evento
     * @return Mono con DTO del tipo de evento o vacío si no existe
     */
    @Override
    public Mono<EventTypeResponseDto> getById(Integer id) {
        return eventTypeRepository.findById(id)
                .switchIfEmpty(Mono.error(new NotFoundException("EventType con ID " + id + " no encontrado.")))
                .map(mapper::toResponseDto);
    }

    /**
     * Actualiza un tipo de evento existente con auditoría.
     *
     * @param id        ID del tipo de evento a actualizar
     * @param requestDto DTO con datos actualizados
     * @param updatedBy UUID del usuario que realiza la actualización
     * @return Mono con DTO actualizado
     */
    @Override
    public Mono<EventTypeResponseDto> update(Integer id, EventTypeRequestDto requestDto, UUID updatedBy) {
        return eventTypeRepository.findById(id)
                .switchIfEmpty(Mono.error(new NotFoundException("No se encontró el EventType con ID " + id)))
                .flatMap(existing -> {
                    existing.setEventTypeName(requestDto.getEventTypeName());
                    existing.setStatus(requestDto.getStatus());
                    existing.setUpdatedAt(LocalDateTime.now());
                    existing.setUpdatedBy(updatedBy);
                    return eventTypeRepository.save(existing);
                })
                .map(mapper::toResponseDto);
    }

    /**
     * Elimina un tipo de evento por su ID.
     *
     * @param id ID del tipo de evento a eliminar
     * @return Mono vacío que indica finalización de la operación
     */
    @Override
    public Mono<Void> deleteById(Integer id) {
        return eventTypeRepository.findById(id)
                .switchIfEmpty(Mono.error(new NotFoundException("No existe el EventType con ID " + id)))
                .flatMap(event -> eventTypeRepository.deleteById(id));
    }
}
