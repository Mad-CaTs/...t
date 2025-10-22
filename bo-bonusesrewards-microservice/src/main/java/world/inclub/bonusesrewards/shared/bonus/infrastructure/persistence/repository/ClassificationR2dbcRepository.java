package world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.entity.ClassificationEntity;

import java.util.Collection;
import java.util.UUID;

public interface ClassificationR2dbcRepository
        extends R2dbcRepository<ClassificationEntity, UUID> {
    Flux<ClassificationEntity> findByMemberIdAndRankIdIn(Long memberId, Collection<Long> rankIds);

    @Query("""
                SELECT c.*
                FROM bo_bonus_reward.classifications c
                JOIN bo_bonus_reward.car_quotations cq ON cq.classification_id = c.id
                JOIN bo_bonus_reward.car_assignments ca ON ca.quotation_id = cq.id
                WHERE ca.id = :carAssignmentId
                LIMIT 1
            """)
    Mono<ClassificationEntity> findByCarAssignmentId(UUID carAssignmentId);

}