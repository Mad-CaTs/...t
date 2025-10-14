package world.inclub.bonusesrewards.carbonus.application.usecase.carrankbonus;

import reactor.core.publisher.Mono;

import java.util.UUID;

public interface DeleteCarRankBonusUseCase {

    /**
     * Deletes a CarRankBonus by its ID.
     *
     * @param id the ID of the CarRankBonus to delete
     * @return a Mono signaling completion or error
     */
    Mono<Void> deleteById(UUID id);
}
