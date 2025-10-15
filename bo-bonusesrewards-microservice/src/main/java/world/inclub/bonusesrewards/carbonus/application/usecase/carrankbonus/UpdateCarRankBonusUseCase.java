package world.inclub.bonusesrewards.carbonus.application.usecase.carrankbonus;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.CarRankBonus;

import java.util.UUID;

public interface UpdateCarRankBonusUseCase {

    /**
     * Updates an existing CarRankBonus.
     *
     * @param id           the ID of the CarRankBonus to update
     * @param carRankBonus the CarRankBonus object with updated information
     * @return a Mono emitting the updated CarRankBonus object
     */
    Mono<CarRankBonus> update(UUID id, CarRankBonus carRankBonus);

}
