package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.Car;
import world.inclub.bonusesrewards.carbonus.domain.port.CarRepositoryPort;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.mapper.CarMapper;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository.CarR2dbcRepository;

import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class CarRepositoryAdapter
        implements CarRepositoryPort {

    private final CarMapper carMapper;
    private final CarR2dbcRepository r2dbcRepository;

    @Override
    public Mono<Car> findById(UUID id) {
        return r2dbcRepository.findById(id)
                .map(carMapper::toDomain);
    }

    @Override
    public Flux<Car> findAll() {
        return r2dbcRepository.findAll()
                .map(carMapper::toDomain);
    }

    @Override
    public Mono<Car> save(Car car) {
        return r2dbcRepository.save(carMapper.toEntity(car))
                .map(carMapper::toDomain);
    }

    @Override
    public Mono<Void> deleteById(UUID id) {
        return r2dbcRepository.deleteById(id);
    }

}
