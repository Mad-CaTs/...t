package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarAssignmentsActiveViewEntity;

import java.time.Instant;
import java.util.UUID;

@Repository
public interface CarAssignmentsActiveR2dbcRepository
        extends R2dbcRepository<CarAssignmentsActiveViewEntity, UUID> {

    @Query("""
        SELECT * FROM bo_bonus_reward.car_assignments_active_view
        WHERE (:member IS NULL OR LOWER(CONCAT(member_full_name, ' ', username)) LIKE LOWER(CONCAT('%', :member, '%')))
          AND (:modelName IS NULL OR LOWER(model_name) LIKE LOWER(CONCAT('%', :modelName, '%')))
          AND (:startDate IS NULL OR assigned_date >= :startDate)
          AND (:endDate IS NULL OR assigned_date <= :endDate)
        ORDER BY assigned_date DESC
        LIMIT :limit OFFSET :offset
        """)
    Flux<CarAssignmentsActiveViewEntity> findWithFilters(
            @Param("member") String member,
            @Param("modelName") String modelName,
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate,
            @Param("limit") Integer limit,
            @Param("offset") Integer offset
    );

    @Query("""
        SELECT COUNT(*) FROM bo_bonus_reward.car_assignments_active_view
        WHERE (:member IS NULL OR LOWER(CONCAT(member_full_name, ' ', username)) LIKE LOWER(CONCAT('%', :member, '%')))
          AND (:modelName IS NULL OR LOWER(model_name) LIKE LOWER(CONCAT('%', :modelName, '%')))
          AND (:startDate IS NULL OR assigned_date >= :startDate)
          AND (:endDate IS NULL OR assigned_date <= :endDate)
        """)
    Mono<Long> countWithFilters(
            @Param("member") String member,
            @Param("modelName") String modelName,
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate
    );

}