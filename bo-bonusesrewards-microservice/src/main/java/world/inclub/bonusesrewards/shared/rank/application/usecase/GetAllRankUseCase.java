package world.inclub.bonusesrewards.shared.rank.application.usecase;

import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.shared.rank.domain.model.Rank;

public interface GetAllRankUseCase {

    /**
     * Retrieves all ranks.
     *
     * @return a Flux stream of all Rank objects
     */
    Flux<Rank> getAllRanks();

}
