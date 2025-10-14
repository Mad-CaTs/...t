package world.inclub.bonusesrewards.shared.rank.application.usecase;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.rank.domain.model.Rank;

public interface GetRankByIdUseCase {

    /**
     * Retrieves a rank by its ID.
     *
     * @param id the ID of the rank to retrieve
     * @return a Mono emitting the Rank object if found, or empty if not found
     */
    Mono<Rank> getRankById(Long id);

}
