package world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.bonus.domain.model.Prequalification;
import world.inclub.bonusesrewards.shared.bonus.domain.port.CompoundPeriodRepositoryPort;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.repository.mongo.CompoundPeriodReactiveMongoRepository;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.repository.mongo.PrequalificationResult;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class CompoundPeriodRepositoryAdapter
        implements CompoundPeriodRepositoryPort {

    private final CompoundPeriodReactiveMongoRepository mongoRepository;

    @Override
    public Flux<Prequalification> findTopRequalifications(
            Long periodMin,
            Long periodMax,
            Long rankId,
            Long minRequalifications
    ) {
        return mongoRepository.findTopRequalifications(
                periodMin, periodMax, rankId, 1L, minRequalifications
        ).map(this::toDomain);
    }

    @Override
    public Flux<Prequalification> findTopRequalificationsPaginated(
            Long periodMin,
            Long periodMax,
            Long rankId,
            Long minRequalifications,
            Pageable pageable
    ) {
        return mongoRepository.findTopRequalificationsPaginated(
                periodMin, periodMax, rankId, 1L, minRequalifications,
                pageable.offset(), pageable.limit()
        ).map(this::toDomain);
    }

    @Override
    public Mono<Long> countPrequalifications(
            Long periodMin,
            Long periodMax,
            Long rankId,
            Long minRequalifications
    ) {
        return mongoRepository.countPrequalifications(
                periodMin, periodMax, rankId, 1L, minRequalifications
        );
    }

    @Override
    public Flux<Prequalification> findByMemberIds(
            List<Long> memberIds,
            Long periodMin,
            Long periodMax,
            Long rankId,
            Long minRequalifications
    ) {
        return mongoRepository.findByMemberIds(
                memberIds, periodMin, periodMax, rankId, 1L, minRequalifications
        ).map(this::toDomain);
    }

    private Prequalification toDomain(PrequalificationResult result) {
        return new Prequalification(
                result.userId(),
                result.rankId(),
                result.rankName(),
                result.numRequalifications(),
                result.totalDirectPoints(),
                result.startPeriod(),
                result.endPeriod()
        );
    }
}