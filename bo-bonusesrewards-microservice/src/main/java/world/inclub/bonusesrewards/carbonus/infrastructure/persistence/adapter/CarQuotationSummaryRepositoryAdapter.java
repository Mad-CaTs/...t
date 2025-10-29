package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarQuotationSummary;
import world.inclub.bonusesrewards.carbonus.domain.port.CarQuotationSummaryRepositoryPort;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarQuotationSummaryViewEntity;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.mapper.CarQuotationSummaryViewEntityMapper;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository.CarQuotationSummaryR2dbcRepository;
import world.inclub.bonusesrewards.shared.rank.domain.port.RankRepositoryPort;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

@Repository
@RequiredArgsConstructor
public class CarQuotationSummaryRepositoryAdapter
        implements CarQuotationSummaryRepositoryPort {

    private final CarQuotationSummaryR2dbcRepository carQuotationSummaryR2dbcRepository;
    private final RankRepositoryPort rankRepositoryPort;
    private final CarQuotationSummaryViewEntityMapper carQuotationSummaryViewEntityMapper;

    @Override
    public Flux<CarQuotationSummary> findWithFilters(
            String member,
            Long rankId,
            Boolean isReviewed,
            Pageable pageable
    ) {
        return findSummaries(
                carQuotationSummaryR2dbcRepository
                        .findWithFilters(member, rankId, isReviewed, pageable.limit(), pageable.offset())
        );
    }

    @Override
    public Mono<Long> countWithFilters(String member, Long rankId, Boolean isReviewed) {
        return carQuotationSummaryR2dbcRepository
                .countWithFilters(member, rankId, isReviewed);
    }

    @Override
    public Flux<CarQuotationSummary> findAll(String member, Long rankId, Boolean isReviewed) {
        return findSummaries(
                carQuotationSummaryR2dbcRepository
                        .findAllWithFilters(member, rankId, isReviewed)
        );
    }

    private Flux<CarQuotationSummary> findSummaries(Flux<CarQuotationSummaryViewEntity> source) {
        return RankMappingUtil.mapEntitiesWithRanks(
                source,
                CarQuotationSummaryViewEntity::getMemberId,
                CarQuotationSummaryViewEntity::getRankId,
                carQuotationSummaryViewEntityMapper::toDomain,
                rankRepositoryPort
        );
    }

}
