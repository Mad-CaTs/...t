package world.inclub.ticket.infraestructure.repository;

import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.model.SeatType;
import world.inclub.ticket.domain.repository.SeatTypeRepository;
import world.inclub.ticket.api.mapper.SeatTypeMapper;
import world.inclub.ticket.infraestructure.persistence.SpringDataR2dbcSeatTypeRepository;
import world.inclub.ticket.domain.entity.SeatTypeEntity;

@Repository
public class R2dbcSeatTypeRepository implements SeatTypeRepository {

    private final SpringDataR2dbcSeatTypeRepository springDataRepository;
    private final SeatTypeMapper mapper;

    public R2dbcSeatTypeRepository(SpringDataR2dbcSeatTypeRepository springDataRepository, SeatTypeMapper mapper) {
        this.springDataRepository = springDataRepository;
        this.mapper = mapper;
    }

    @Override
    public Mono<SeatType> save(SeatType seatType) {
        SeatTypeEntity entity = mapper.toEntity(seatType);
        return springDataRepository.save(entity)
                .map(mapper::toDomain);
    }

    @Override
    public Flux<SeatType> findAll() {
        return springDataRepository.findAll()
                .map(mapper::toDomain);
    }

    @Override
    public Mono<SeatType> findById(Integer id) {
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
