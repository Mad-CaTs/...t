package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Mono;

/**
 * Define el contrato para eliminar un tipo de evento por su ID.
 */
public interface DeleteEventTypeUseCase {
    /**
     * Elimina un tipo de evento.
     *
     * @param id identificador del tipo de evento a eliminar
     * @return Mono vacío si fue exitoso
     */
    Mono<Void> deleteById(Integer id);
}
