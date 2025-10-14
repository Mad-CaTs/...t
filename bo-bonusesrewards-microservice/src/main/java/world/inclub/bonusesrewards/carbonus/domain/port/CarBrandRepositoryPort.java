package world.inclub.bonusesrewards.carbonus.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.CarBrand;

public interface CarBrandRepositoryPort {
    Mono<CarBrand> findById(Long id);

    Flux<CarBrand> findAll();

    Flux<CarBrand> findByName(String name);

    Mono<CarBrand> save(CarBrand carBrand);

    Mono<Void> deleteById(Long id);
}
