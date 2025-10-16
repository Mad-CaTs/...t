package world.inclub.ticket.infraestructure.repository;

import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.model.EventZone;
import world.inclub.ticket.domain.repository.EventZoneRepository;
import world.inclub.ticket.api.mapper.EventZoneMapper;
import world.inclub.ticket.infraestructure.persistence.SpringDataR2dbcEventZoneRepository;
import world.inclub.ticket.domain.entity.EventZoneEntity;

import java.util.Collection;

@Repository
public class R2dbcEventZoneRepository implements EventZoneRepository {

    private final SpringDataR2dbcEventZoneRepository repository;
    private final EventZoneMapper mapper;

    public R2dbcEventZoneRepository(SpringDataR2dbcEventZoneRepository repository, EventZoneMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Mono<EventZone> save(EventZone eventZone) {
        EventZoneEntity entity = mapper.toEntity(eventZone);
        return repository.save(entity)
                .map(mapper::toDomain);
    }

    @Override
    public Flux<EventZone> findAll() {
        return repository.findAll()
                .map(mapper::toDomain);
    }

    @Override
    public Mono<EventZone> findById(Integer id) {
        return repository.findById(id)
                .map(mapper::toDomain);
    }

    @Override
    public Mono<Void> deleteById(Integer id) {
        return repository.deleteById(id);
    }

    @Override
    public Mono<Boolean> existsById(Integer id) {
        return repository.existsById(id);
    }

    @Override
    public Flux<EventZone> findByEventId(Integer eventId) {
        return repository.findByEventId(eventId)
                .map(mapper::toDomain);
    }

    @Override
    public Mono<Integer> reserveAvailableTickets(Integer eventZoneId, Integer quantity) {
        return repository.reserveAvailableTickets(eventZoneId, quantity);
    }

    @Override
    public Mono<Integer> restoreCapacity(Integer eventZoneId, Integer quantity) {
        return repository.restoreCapacity(eventZoneId, quantity);
    }

    @Override
    public Flux<EventZone> findByEventZoneIdIn(Collection<Integer> eventZoneIds) {
        return repository.findByEventZoneIdIn(eventZoneIds)
                .map(mapper::toDomain);
    }

    @Override
    public Mono<Void> deleteAllByEventZoneIdIn(Collection<Integer> eventZoneIds) {
        return repository.deleteAllByEventZoneIdIn(eventZoneIds);
    }

}