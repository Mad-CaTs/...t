package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.EventTypeResponseDto;

/**
 * Define el contrato para obtener un tipo de evento específico por ID.
 */
public interface GetEventTypeByIdUseCase {
    /**
     * Retorna un tipo de evento según su ID.
     *
     * @param id identificador del tipo de evento
     * @return un Mono con el DTO de respuesta, o vacío si no existe
     */
    Mono<EventTypeResponseDto> getById(Integer id);
}
