package world.inclub.bonusesrewards.shared.bonus.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.bonus.domain.model.Classification;

import java.util.Collection;
import java.util.UUID;

public interface ClassificationRepositoryPort {
    Mono<Classification> save(Classification classification);

    Flux<Classification> findByMemberIdAndRankIds(Long memberId, Collection<Long> rankId);

    Flux<Classification> findByRankId(Long rankId);

    Mono<Classification> findById(UUID id);

    Flux<Classification> findByIds(Collection<UUID> ids);

    Mono<Classification> findByCarAssignmentId(UUID carAssignmentId);
}