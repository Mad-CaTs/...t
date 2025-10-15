package world.inclub.bonusesrewards.shared.bonus.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.bonus.domain.model.BonusRequirement;

import java.util.UUID;

public interface BonusRequirementRepositoryPort {
    Mono<BonusRequirement> findById(UUID id);

    Flux<BonusRequirement> findAll();

    Mono<BonusRequirement> save(BonusRequirement bonusRequirement);

    Mono<Void> deleteById(UUID id);

    Flux<BonusRequirement> findByRankId(Long rankId);
}