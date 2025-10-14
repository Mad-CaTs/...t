package world.inclub.ticket.infraestructure.repository;

import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.model.EventType;
import world.inclub.ticket.domain.repository.EventTypeRepository;
import world.inclub.ticket.api.mapper.EventTypeMapper;
import world.inclub.ticket.infraestructure.persistence.SpringDataR2dbcEventTypeRepository;
import world.inclub.ticket.domain.entity.EventTypeEntity;

/**
 * Implementación concreta del repositorio para EventType usando Spring Data R2DBC.
 * Encargado de realizar las operaciones CRUD de forma reactiva,
 * y convertir entre entidades persistentes y modelos de dominio.
 */
@Repository
public class R2dbcEventTypeRepository implements EventTypeRepository {

    private final SpringDataR2dbcEventTypeRepository springDataRepository;
    private final EventTypeMapper mapper;

    /**
     * Constructor que recibe el repositorio Spring Data y el mapper para conversión de datos.
     *
     * @param springDataRepository Repositorio reactivo de Spring Data para EventTypeEntity
     * @param mapper               Mapper para conversión entre entidad y dominio
     */
    public R2dbcEventTypeRepository(SpringDataR2dbcEventTypeRepository springDataRepository,
                                    EventTypeMapper mapper) {
        this.springDataRepository = springDataRepository;
        this.mapper = mapper;
    }

    /**
     * Guarda o actualiza un tipo de evento en la base de datos.
     *
     * @param eventType modelo de dominio a persistir
     * @return Mono con el objeto guardado convertido a modelo de dominio
     */
    @Override
    public Mono<EventType> save(EventType eventType) {
        EventTypeEntity entity = mapper.toEntity(eventType);
        return springDataRepository.save(entity)
                .map(mapper::toDomain);
    }

    /**
     * Obtiene todos los tipos de eventos almacenados.
     *
     * @return Flux con todos los tipos de eventos como modelos de dominio
     */
    @Override
    public Flux<EventType> findAll() {
        return springDataRepository.findAll()
                .map(mapper::toDomain);
    }

    /**
     * Busca un tipo de evento por su identificador.
     *
     * @param id identificador del tipo de evento
     * @return Mono con el tipo de evento encontrado, si existe
     */
    @Override
    public Mono<EventType> findById(Integer id) {
        return springDataRepository.findById(id)
                .map(mapper::toDomain);
    }

    /**
     * Elimina un tipo de evento por su identificador.
     *
     * @param id identificador del tipo de evento a eliminar
     * @return Mono vacío que indica la finalización de la operación
     */
    @Override
    public Mono<Void> deleteById(Integer id) {
        return springDataRepository.deleteById(id);
    }

    /**
     * Verifica si existe un tipo de evento con el identificador dado.
     *
     * @param id identificador a verificar
     * @return Mono con true si existe, false en caso contrario
     */
    @Override
    public Mono<Boolean> existsById(Integer id) {
        return springDataRepository.existsById(id);
    }
}