package world.inclub.ticket.infraestructure.repository;

import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.model.EventMedia;
import world.inclub.ticket.domain.repository.EventMediaRepository;
import world.inclub.ticket.api.mapper.EventMediaMapper;
import world.inclub.ticket.infraestructure.persistence.SpringDataR2dbcEventMediaRepository;

@Repository
public class R2dbcEventMediaRepository implements EventMediaRepository {

    private final SpringDataR2dbcEventMediaRepository repository;
    private final EventMediaMapper mapper;

    public R2dbcEventMediaRepository(SpringDataR2dbcEventMediaRepository repository, EventMediaMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Mono<EventMedia> save(EventMedia eventMedia) {
        return repository.save(mapper.toEntity(eventMedia))
                .map(mapper::toDomain);
    }

    @Override
    public Flux<EventMedia> findAll() {
        return repository.findAll()
                .map(mapper::toDomain);
    }

    @Override
    public Mono<EventMedia> findById(Integer id) {
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
    public Mono<EventMedia> findByEventId(Integer eventId) {
        return repository.findByEventId(eventId)
                .map(mapper::toDomain);
    }

    @Override
    public Mono<EventMedia> findTopByEventIdOrderByUpdatedAtDesc(Integer eventId) {
        return repository.findTopByEventIdOrderByUpdatedAtDesc(eventId)
                .map(mapper::toDomain);
    }
}