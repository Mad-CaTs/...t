package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.EventTypeRequestDto;
import world.inclub.ticket.api.dto.EventTypeResponseDto;

import java.util.UUID;

/**
 * Define el contrato para crear un nuevo tipo de evento.
 */
public interface CreateEventTypeUseCase {
    /**
     * Crea un nuevo tipo de evento.
     *
     * @param dto los datos de entrada del nuevo tipo de evento
     * @param userId identificador del usuario que realiza la creación (auditoría)
     * @return un Mono con el DTO de respuesta
     */
    Mono<EventTypeResponseDto> create(EventTypeRequestDto dto, UUID userId);
}
