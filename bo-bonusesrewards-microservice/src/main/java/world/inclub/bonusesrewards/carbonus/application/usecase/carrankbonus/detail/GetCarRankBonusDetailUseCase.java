package world.inclub.bonusesrewards.carbonus.application.usecase.carrankbonus.detail;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.CarRankBonusDetail;

import java.util.UUID;

public interface GetCarRankBonusDetailUseCase {

    /**
     * Retrieves detailed information about a CarRankBonus by its ID.
     *
     * @param id the ID of the CarRankBonus
     * @return a Mono emitting the CarRankBonusDetail if found, or empty if not found
     */
    Mono<CarRankBonusDetail> getById(UUID id);

}
