package world.inclub.bonusesrewards.carbonus.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.CarRankBonus;

import java.util.Collection;
import java.util.UUID;

public interface CarRankBonusRepositoryPort {
    Mono<CarRankBonus> save(CarRankBonus carRankBonus);

    Mono<CarRankBonus> findById(UUID id);

    Mono<CarRankBonus> findByRankIdAndStatusId(Long rankId, Long statusId);

    Flux<CarRankBonus> findByStatusId(Long statusId);

    Mono<Void> deleteById(UUID id);

    Mono<Boolean> existsByStatusIdAndRankId(Long rankId, Long statusId);
}