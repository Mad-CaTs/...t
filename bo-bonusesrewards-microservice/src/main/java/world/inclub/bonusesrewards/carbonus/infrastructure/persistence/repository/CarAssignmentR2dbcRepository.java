package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarAssignmentEntity;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarAssignmentWithClassificationDTO;

import java.util.Collection;
import java.util.UUID;

@Repository
public interface CarAssignmentR2dbcRepository
        extends R2dbcRepository<CarAssignmentEntity, UUID> {

    Mono<Boolean> existsByRankBonusId(UUID rankBonusId);

    @Query("""
            SELECT c.id AS classification_id,
                   ca.id AS car_assignment_id
            FROM bo_bonus_reward.car_assignments ca
                     INNER JOIN bo_bonus_reward.car_quotations cq
                                ON ca.quotation_id = cq.id
                                    AND cq.is_accepted = TRUE
                     INNER JOIN bo_bonus_reward.classifications c
                                ON ca.member_id = c.member_id
            WHERE c.id IN (:classificationIds)
            """)
    Flux<CarAssignmentWithClassificationDTO> findByClassificationIdIn(@Param("classificationIds") Collection<UUID> classificationIds);

}