package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Flux;
import world.inclub.ticket.api.dto.EventTypeResponseDto;

/**
 * Define el contrato para obtener todos los tipos de eventos registrados.
 */
public interface GetAllEventTypesUseCase {
    /**
     * Retorna todos los tipos de eventos registrados.
     *
     * @return un Flux de DTOs con los tipos de eventos
     */
    Flux<EventTypeResponseDto> getAll();
}
