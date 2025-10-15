package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarModelEntity;

public interface CarModelR2dbcRepository
        extends ReactiveCrudRepository<CarModelEntity, Long> {
    Flux<CarModelEntity> findByBrandIdAndNameContainingIgnoreCase(Long brandId, String name);
}
