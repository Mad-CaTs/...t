package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.CarModel;
import world.inclub.bonusesrewards.carbonus.domain.port.CarModelRepositoryPort;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.mapper.CarModelMapper;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository.CarModelR2dbcRepository;

@Repository
@RequiredArgsConstructor
public class CarModelRepositoryAdapter
        implements CarModelRepositoryPort {

    private final CarModelMapper carModelMapper;
    private final CarModelR2dbcRepository r2dbcRepository;

    @Override
    public Mono<CarModel> findById(Long id) {
        return r2dbcRepository.findById(id)
                .map(carModelMapper::toDomain);
    }

    @Override
    public Flux<CarModel> findAll() {
        return r2dbcRepository.findAll()
                .map(carModelMapper::toDomain);
    }

    @Override
    public Flux<CarModel> findByBrandIdAndName(Long brandId, String name) {
        return r2dbcRepository.findByBrandIdAndNameContainingIgnoreCase(brandId, name)
                .map(carModelMapper::toDomain);
    }

    @Override
    public Mono<CarModel> save(CarModel carModel) {
        return r2dbcRepository.save(carModelMapper.toEntity(carModel))
                .map(carModelMapper::toDomain);
    }

    @Override
    public Mono<Void> deleteById(Long id) {
        return r2dbcRepository.deleteById(id);
    }
}
