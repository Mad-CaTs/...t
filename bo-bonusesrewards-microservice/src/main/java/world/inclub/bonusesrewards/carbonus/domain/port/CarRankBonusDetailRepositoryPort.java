package world.inclub.bonusesrewards.carbonus.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.criteria.CarRankBonusDetailSearchCriteria;
import world.inclub.bonusesrewards.carbonus.domain.model.CarRankBonusDetail;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

import java.util.UUID;

public interface CarRankBonusDetailRepositoryPort {
    Mono<CarRankBonusDetail> findById(UUID id);

    Flux<CarRankBonusDetail> findAll(CarRankBonusDetailSearchCriteria criteria, Pageable pageable);

    Mono<Long> countCarRankBonusDetails(CarRankBonusDetailSearchCriteria criteria);
}