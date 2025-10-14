package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.criteria.CarRankBonusDetailSearchCriteria;
import world.inclub.bonusesrewards.carbonus.domain.model.CarRankBonusDetail;
import world.inclub.bonusesrewards.carbonus.domain.port.CarRankBonusDetailRepositoryPort;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.mapper.CarRankBonusDetailMapper;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository.CarRankBonusDetailR2dbcRepository;
import world.inclub.bonusesrewards.shared.rank.domain.model.Rank;
import world.inclub.bonusesrewards.shared.rank.domain.port.RankRepositoryPort;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class CarRankBonusDetailRepositoryAdapter
        implements CarRankBonusDetailRepositoryPort {

    private final RankRepositoryPort rankRepositoryPort;
    private final CarRankBonusDetailR2dbcRepository carRankBonusDetailR2dbcRepository;
    private final CarRankBonusDetailMapper carRankBonusDetailMapper;

    @Override
    public Mono<CarRankBonusDetail> findById(UUID id) {
        return carRankBonusDetailR2dbcRepository.findById(id)
                .flatMap(entity -> rankRepositoryPort.findById(entity.getRankId())
                        .map(rank -> carRankBonusDetailMapper.toDomain(entity, rank))
                );
    }

    @Override
    public Flux<CarRankBonusDetail> findAll(CarRankBonusDetailSearchCriteria criteria, Pageable pageable) {
        return rankRepositoryPort.findAll()
                .collectMap(Rank::id)
                .flatMapMany(rankMap -> carRankBonusDetailR2dbcRepository.findWithFilters(
                                             criteria.rankId(),
                                             criteria.startDate(),
                                             criteria.endDate(),
                                             criteria.onlyActive(),
                                             criteria.currentDate(),
                                             pageable.limit(),
                                             pageable.offset()
                                     )
                                     .map(entity -> carRankBonusDetailMapper
                                             .toDomain(entity, rankMap.get(entity.getRankId())))
                );
    }

    @Override
    public Mono<Long> countCarRankBonusDetails(CarRankBonusDetailSearchCriteria criteria) {
        return carRankBonusDetailR2dbcRepository.countWithFilters(
                criteria.rankId(),
                criteria.startDate(),
                criteria.endDate(),
                criteria.onlyActive(),
                criteria.currentDate()
        );
    }

}