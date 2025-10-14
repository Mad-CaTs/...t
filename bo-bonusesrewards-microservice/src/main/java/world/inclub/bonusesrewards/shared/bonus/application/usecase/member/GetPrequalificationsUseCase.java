package world.inclub.bonusesrewards.shared.bonus.application.usecase.member;

import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.shared.bonus.application.dto.PrequalificationSummary;

public interface GetPrequalificationsUseCase {
    Flux<PrequalificationSummary> getPrequalifications(
        Long periodMin,
        Long periodMax,
        Long rankId,
        Long minRequalifications
    );
}