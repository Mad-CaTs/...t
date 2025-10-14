package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.EventTypeRequestDto;
import world.inclub.ticket.api.dto.EventTypeResponseDto;

import java.util.UUID;

/**
 * Define el contrato para actualizar un tipo de evento existente.
 */
public interface UpdateEventTypeUseCase {
    /**
     * Actualiza los datos de un tipo de evento existente.
     *
     * @param id identificador del tipo de evento a actualizar
     * @param dto datos actualizados
     * @param updatedBy usuario que realizó la modificación
     * @return un Mono con el DTO actualizado
     */
    Mono<EventTypeResponseDto> update(Integer id, EventTypeRequestDto dto, UUID updatedBy);
}
