package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository;

import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarAssignmentEntity;

import java.util.UUID;

@Repository
public interface CarAssignmentR2dbcRepository
        extends R2dbcRepository<CarAssignmentEntity, UUID> {

    Mono<Boolean> existsByRankBonusId(UUID rankBonusId);

}