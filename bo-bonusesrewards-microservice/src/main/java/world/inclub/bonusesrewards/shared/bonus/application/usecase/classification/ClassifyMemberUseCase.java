package world.inclub.bonusesrewards.shared.bonus.application.usecase.classification;

import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.shared.bonus.domain.model.Classification;

import java.util.List;

public interface ClassifyMemberUseCase {
    Flux<Classification> classify(
            List<Long> memberIds,
            Long periodMin,
            Long periodMax,
            Long rankId,
            Long minRequalifications
    );
}