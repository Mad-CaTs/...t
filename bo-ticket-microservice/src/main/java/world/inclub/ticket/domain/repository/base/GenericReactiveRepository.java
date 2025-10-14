package world.inclub.ticket.domain.repository.base;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Contrato genérico para repositorios reactivos que operan sobre entidades del dominio.
 *
 * @param <T>  el tipo del modelo de dominio
 * @param <ID> el tipo de dato del identificador de la entidad
 */
public interface GenericReactiveRepository<T, ID> {
    /**
     * Guarda una entidad (crear o actualizar).
     *
     * @param entity la entidad a guardar
     * @return un Mono con la entidad guardada
     */
    Mono<T> save(T entity);

    /**
     * Obtiene todas las entidades.
     *
     * @return un Flux con todas las entidades
     */
    Flux<T> findAll();

    /**
     * Busca una entidad por su identificador.
     *
     * @param id el identificador
     * @return un Mono con la entidad si existe, vacío en caso contrario
     */
    Mono<T> findById(ID id);

    /**
     * Elimina una entidad por su identificador.
     *
     * @param id el identificador de la entidad
     * @return un Mono que completa cuando se ha eliminado
     */
    Mono<Void> deleteById(ID id);

    /**
     * Verifica si existe una entidad con el identificador dado.
     *
     * @param id el identificador
     * @return un Mono que emite true si existe, false si no
     */
    Mono<Boolean> existsById(ID id);
}