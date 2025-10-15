package world.inclub.bonusesrewards.carbonus.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.Car;

import java.util.UUID;

public interface CarRepositoryPort {
    Mono<Car> findById(UUID id);

    Flux<Car> findAll();

    Mono<Car> save(Car car);

    Mono<Void> deleteById(UUID id);
}
