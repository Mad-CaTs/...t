package world.inclub.bonusesrewards.shared.bonus.domain.port;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.bonus.domain.model.Classification;

import java.util.UUID;

public interface ClassificationRepositoryPort {
    Mono<Classification> save(Classification classification);
}