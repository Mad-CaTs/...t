package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository;

import org.springframework.data.r2dbc.repository.R2dbcRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarRankBonusEntity;

import java.time.Instant;
import java.util.UUID;

public interface CarRankBonusR2dbcRepository
        extends R2dbcRepository<CarRankBonusEntity, UUID> {

    Mono<Boolean> existsByStatusIdAndRankIdAndExpirationDateIsAfter(Long statusId, Long rankId, Instant expirationDateAfter);

    Mono<CarRankBonusEntity> findByRankIdAndStatusIdAndExpirationDateIsAfter(Long rankId, Long statusId, Instant expirationDateAfter);

    Flux<CarRankBonusEntity> findByStatusIdAndExpirationDateIsAfter(Long statusId, Instant expirationDateBefore);

}
