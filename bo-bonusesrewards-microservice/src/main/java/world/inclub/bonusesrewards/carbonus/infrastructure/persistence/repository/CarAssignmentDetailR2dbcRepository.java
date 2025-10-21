package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarAssignmentDetailsViewEntity;

import java.time.Instant;
import java.util.UUID;

@Repository
public interface CarAssignmentDetailR2dbcRepository
        extends R2dbcRepository<CarAssignmentDetailsViewEntity, UUID> {

    @Query("""
                SELECT * FROM bo_bonus_reward.car_assignment_details_view
                WHERE (:brandName IS NULL OR LOWER(brand_name) LIKE LOWER(CONCAT('%', :brandName, '%')))
                  AND (:modelName IS NULL OR LOWER(model_name) LIKE LOWER(CONCAT('%', :modelName, '%')))
                  AND (:startDate IS NULL OR assigned_date >= :startDate)
                  AND (:endDate IS NULL OR assigned_date <= :endDate)
                ORDER BY car_id DESC
                LIMIT :limit OFFSET :offset
            """)
    Flux<CarAssignmentDetailsViewEntity> findWithFilters(
            @Param("brandName") String brandName,
            @Param("modelName") String modelName,
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate,
            @Param("limit") Integer limit,
            @Param("offset") Integer offset
    );


    @Query("""
                SELECT COUNT(*) FROM bo_bonus_reward.car_assignment_details_view 
                WHERE (:brandName IS NULL OR LOWER(brand_name) LIKE LOWER(CONCAT('%', :brandName, '%')))
                  AND (:modelName IS NULL OR LOWER(model_name) LIKE LOWER(CONCAT('%', :modelName, '%')))
                  AND (:startDate IS NULL OR assigned_date >= :startDate)
                  AND (:endDate IS NULL OR assigned_date <= :endDate)
            """)
    Mono<Long> countWithFilters(
            String brandName,
            String modelName,
            Instant startDate,
            Instant endDate
    );

}