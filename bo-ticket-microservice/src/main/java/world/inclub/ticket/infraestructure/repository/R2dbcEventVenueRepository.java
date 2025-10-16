package world.inclub.ticket.infraestructure.repository;

import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.model.EventVenue;
import world.inclub.ticket.domain.repository.EventVenueRepository;
import world.inclub.ticket.api.mapper.EventVenueMapper;
import world.inclub.ticket.infraestructure.persistence.SpringDataR2dbcEventVenueRepository;
import world.inclub.ticket.domain.entity.EventVenueEntity;

@Repository
public class R2dbcEventVenueRepository implements EventVenueRepository {

    private final SpringDataR2dbcEventVenueRepository repository;
    private final EventVenueMapper mapper;

    public R2dbcEventVenueRepository(SpringDataR2dbcEventVenueRepository repository, EventVenueMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Mono<EventVenue> save(EventVenue eventVenue) {
        EventVenueEntity entity = mapper.toEntity(eventVenue);
        return repository.save(entity)
                .map(mapper::toDomain);
    }

    @Override
    public Flux<EventVenue> findAll() {
        return repository.findAll()
                .map(mapper::toDomain);
    }

    @Override
    public Mono<EventVenue> findById(Integer id) {
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
}
