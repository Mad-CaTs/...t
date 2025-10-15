package world.inclub.bonusesrewards.carbonus.application.usecase.carrankbonus;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.CarRankBonus;

public interface SaveCarRankBonusUseCase {

    Mono<CarRankBonus> save(CarRankBonus carRankBonus);

}
