package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.repository.query.Param;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarRankBonusEntity;

import java.time.Instant;
import java.util.UUID;

public interface CarRankBonusDetailR2dbcRepository
        extends R2dbcRepository<CarRankBonusEntity, UUID> {

    @Query("""
                SELECT *
                FROM bo_bonus_reward.car_rank_bonuses
                WHERE (:rankId IS NULL OR rank_id = :rankId)
                  AND (
                          (:startDate IS NOT NULL AND :endDate IS NOT NULL AND issue_date <= :endDate AND expiration_date >= :startDate)
                          OR (:startDate IS NOT NULL AND :endDate IS NULL AND expiration_date >= :startDate)
                          OR (:startDate IS NULL AND :endDate IS NOT NULL AND issue_date <= :endDate)
                          OR (:startDate IS NULL AND :endDate IS NULL)
                      )
                  AND (
                      :onlyActive IS NULL
                      OR (:onlyActive = true AND status_id = 1 AND expiration_date >= :currentDate)
                      OR (:onlyActive = false AND (status_id != 1 OR expiration_date < :currentDate))
                  )
                ORDER BY created_at DESC
                LIMIT :limit OFFSET :offset
            """)
    Flux<CarRankBonusEntity> findWithFilters(
            @Param("rankId") Long rankId,
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate,
            @Param("onlyActive") Boolean onlyActive,
            @Param("currentDate") Instant currentDate,
            @Param("limit") Integer limit,
            @Param("offset") Integer offset
    );

    @Query("""
                SELECT COUNT(*)
                FROM bo_bonus_reward.car_rank_bonuses
                WHERE (:rankId IS NULL OR rank_id = :rankId)
                  AND (
                          (:startDate IS NOT NULL AND :endDate IS NOT NULL AND issue_date <= :endDate AND expiration_date >= :startDate)
                          OR (:startDate IS NOT NULL AND :endDate IS NULL AND expiration_date >= :startDate)
                          OR (:startDate IS NULL AND :endDate IS NOT NULL AND issue_date <= :endDate)
                          OR (:startDate IS NULL AND :endDate IS NULL)
                      )
                  AND (
                      :onlyActive IS NULL
                      OR (:onlyActive = true AND status_id = 1 AND expiration_date >= :currentDate)
                      OR (:onlyActive = false AND (status_id != 1 OR expiration_date < :currentDate))
                  )
            """)
    Mono<Long> countWithFilters(
            @Param("rankId") Long rankId,
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate,
            @Param("onlyActive") Boolean onlyActive,
            @Param("currentDate") Instant currentDate
    );

}
