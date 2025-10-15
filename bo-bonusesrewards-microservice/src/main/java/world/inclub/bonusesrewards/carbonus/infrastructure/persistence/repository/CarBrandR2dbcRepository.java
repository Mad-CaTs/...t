package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository;

import org.springframework.data.r2dbc.repository.R2dbcRepository;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarBrandEntity;

import reactor.core.publisher.Flux;

public interface CarBrandR2dbcRepository
        extends R2dbcRepository<CarBrandEntity, Long> {
    Flux<CarBrandEntity> findByNameContainsIgnoreCase(String name);
}
