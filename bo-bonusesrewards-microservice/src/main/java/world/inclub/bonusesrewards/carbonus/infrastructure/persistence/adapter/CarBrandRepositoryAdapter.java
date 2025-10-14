package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.CarBrand;
import world.inclub.bonusesrewards.carbonus.domain.port.CarBrandRepositoryPort;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.mapper.CarBrandMapper;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository.CarBrandR2dbcRepository;

@Repository
@RequiredArgsConstructor
public class CarBrandRepositoryAdapter
        implements CarBrandRepositoryPort {

    private final CarBrandMapper carBrandMapper;
    private final CarBrandR2dbcRepository r2dbcRepository;

    @Override
    public Mono<CarBrand> findById(Long id) {
        return r2dbcRepository.findById(id)
                .map(carBrandMapper::toDomain);
    }

    @Override
    public Flux<CarBrand> findAll() {
        return r2dbcRepository.findAll()
                .map(carBrandMapper::toDomain);
    }

    @Override
    public Flux<CarBrand> findByName(String name) {
        return r2dbcRepository.findByNameContainsIgnoreCase(name)
                .map(carBrandMapper::toDomain);
    }

    @Override
    public Mono<CarBrand> save(CarBrand carBrand) {
        return r2dbcRepository.save(carBrandMapper.toEntity(carBrand))
                .map(carBrandMapper::toDomain);
    }

    @Override
    public Mono<Void> deleteById(Long id) {
        return r2dbcRepository.deleteById(id);
    }

}
