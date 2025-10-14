package world.inclub.ticket.infraestructure.repository;

import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.model.Event;
import world.inclub.ticket.domain.repository.EventRepository;
import world.inclub.ticket.api.mapper.EventMapper;
import world.inclub.ticket.infraestructure.persistence.SpringDataR2dbcEventRepository;
import world.inclub.ticket.domain.entity.EventEntity;

import java.util.Collection;

@Repository
public class R2dbcEventRepository implements EventRepository {

    private final SpringDataR2dbcEventRepository repository;
    private final EventMapper mapper;

    public R2dbcEventRepository(SpringDataR2dbcEventRepository repository, EventMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Mono<Event> save(Event event) {
        EventEntity entity = mapper.toEntity(event);
        return repository.save(entity)
                .map(mapper::toDomain);
    }

    @Override
    public Flux<Event> findAll() {
        return repository.findAll()
                .map(mapper::toDomain);
    }

    @Override
    public Mono<Event> findById(Integer integer) {
        return repository.findById(integer).map(mapper::toDomain);
    }

    @Override
    public Mono<Void> deleteById(Integer integer) {
        return repository.deleteById(integer);
    }

    @Override
    public Mono<Boolean> existsById(Integer integer) {
        return repository.existsById(integer);
    }

    @Override
    public Flux<Event> findByStatusEvent(String statusEvent) {
        return repository.findByStatusEvent(statusEvent)
                .map(mapper::toDomain);
    }

    @Override
    public Flux<Event> findByIdIn(Collection<Integer> ids) {
        return repository.findByEventIdIn(ids)
                .map(mapper::toDomain);
    }

    @Override
    public Mono<String> findEventNameById(Integer eventId) {
        return repository.findEventNameById(eventId);
    }
}