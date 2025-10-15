package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository;

import org.springframework.data.r2dbc.repository.R2dbcRepository;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarRankBonusEntity;

import java.util.UUID;

public interface CarRankBonusR2dbcRepository
        extends R2dbcRepository<CarRankBonusEntity, UUID> {

    Mono<Boolean> existsByStatusIdAndRankId(Long statusId, Long rankId);

    Mono<CarRankBonusEntity> findByRankIdAndStatusId(Long rankId, Long statusId);
    
}
