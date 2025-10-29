package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarAssignmentDocumentSummary;
import world.inclub.bonusesrewards.carbonus.domain.port.CarAssignmentDocumentSummaryRepositoryPort;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarAssignmentDocumentSummaryViewEntity;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.mapper.CarAssignmentDocumentSummaryViewEntityMapper;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository.CarAssignmentDocumentSummaryR2dbcRepository;
import world.inclub.bonusesrewards.shared.rank.domain.model.Rank;
import world.inclub.bonusesrewards.shared.rank.domain.port.RankRepositoryPort;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

@Repository
@RequiredArgsConstructor
public class CarAssignmentDocumentSummaryRepositoryAdapter
        implements CarAssignmentDocumentSummaryRepositoryPort {

    private final CarAssignmentDocumentSummaryR2dbcRepository carAssignmentDocumentSummaryR2dbcRepository;
    private final RankRepositoryPort rankRepositoryPort;
    private final CarAssignmentDocumentSummaryViewEntityMapper carAssignmentDocumentSummaryViewEntityMapper;

    @Override
    public Flux<CarAssignmentDocumentSummary> findWithFilters(
            String member,
            Long rankId,
            Integer documentCount,
            Pageable pageable
    ) {
        return findSummaries(
                carAssignmentDocumentSummaryR2dbcRepository
                        .findWithFilters(member, rankId, documentCount, pageable.limit(), pageable.offset())
        );
    }

    @Override
    public Mono<Long> countWithFilters(String member, Long rankId, Integer documentCount) {
        return carAssignmentDocumentSummaryR2dbcRepository
                .countWithFilters(member, rankId, documentCount);
    }

    private Flux<CarAssignmentDocumentSummary> findSummaries(Flux<CarAssignmentDocumentSummaryViewEntity> source) {
        return RankMappingUtil .mapEntitiesWithRanks(
                source,
                CarAssignmentDocumentSummaryViewEntity::getMemberId,
                CarAssignmentDocumentSummaryViewEntity::getMemberRankId,
                carAssignmentDocumentSummaryViewEntityMapper::toDomain,
                rankRepositoryPort
        );
    }

}