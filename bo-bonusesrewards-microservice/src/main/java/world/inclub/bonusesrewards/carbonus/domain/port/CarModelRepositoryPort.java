package world.inclub.bonusesrewards.carbonus.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.CarModel;

public interface CarModelRepositoryPort {
    Mono<CarModel> findById(Long id);

    Flux<CarModel> findAll();

    Flux<CarModel> findByBrandIdAndName(Long brandId, String name);

    Mono<CarModel> save(CarModel carModel);

    Mono<Void> deleteById(Long id);
}
