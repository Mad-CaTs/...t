package world.inclub.bonusesrewards.carbonus.domain.port;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.CarBonusApplication;

public interface CarBonusApplicationRepositoryPort {
    Mono<CarBonusApplication> save(CarBonusApplication carBonusApplication);
}
