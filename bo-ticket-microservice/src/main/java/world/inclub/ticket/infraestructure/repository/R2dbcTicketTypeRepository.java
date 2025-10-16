package world.inclub.ticket.infraestructure.repository;

import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.model.TicketType;
import world.inclub.ticket.domain.repository.TicketTypeRepository;
import world.inclub.ticket.api.mapper.TicketTypeMapper;
import world.inclub.ticket.infraestructure.persistence.SpringDataR2dbcTicketTypeRepository;
import world.inclub.ticket.domain.entity.TicketTypeEntity;

@Repository
public class R2dbcTicketTypeRepository implements TicketTypeRepository {

    private final SpringDataR2dbcTicketTypeRepository springDataRepository;
    private final TicketTypeMapper mapper;

    public R2dbcTicketTypeRepository(SpringDataR2dbcTicketTypeRepository springDataRepository,
                                     TicketTypeMapper mapper) {
        this.springDataRepository = springDataRepository;
        this.mapper = mapper;
    }

    @Override
    public Mono<TicketType> save(TicketType ticketType) {
        TicketTypeEntity entity = mapper.toEntity(ticketType);
        return springDataRepository.save(entity)
                .map(mapper::toDomain);
    }

    @Override
    public Flux<TicketType> findAll() {
        return springDataRepository.findAll()
                .map(mapper::toDomain);
    }

    @Override
    public Mono<TicketType> findById(Integer id) {
        return springDataRepository.findById(id)
                .map(mapper::toDomain);
    }

    @Override
    public Mono<Void> deleteById(Integer id) {
        return springDataRepository.deleteById(id);
    }

    @Override
    public Mono<Boolean> existsById(Integer id) {
        return springDataRepository.existsById(id);
    }
}
