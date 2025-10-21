package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.repository.query.Param;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarQuotationPendingAssignmentViewEntity;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarQuotationSelectedViewEntity;

import java.util.UUID;

public interface CarQuotationSelectedR2dbcRepository
        extends R2dbcRepository<CarQuotationSelectedViewEntity, UUID> {

    @Query("""
            SELECT * FROM bo_bonus_reward.car_quotation_selected_view
            WHERE (:member IS NULL OR LOWER(CONCAT(member_full_name, ' ', username)) LIKE LOWER(CONCAT('%', :member, '%')))
              AND (:rankId IS NULL OR rank_id = :rankId)
            ORDER BY accepted_at DESC
            LIMIT :limit OFFSET :offset
            """)
    Flux<CarQuotationSelectedViewEntity> findWithFilters(
            @Param("member") String member,
            @Param("rankId") Long rankId,
            @Param("limit") Integer limit,
            @Param("offset") Integer offset
    );

    @Query("""
            SELECT COUNT(*) FROM bo_bonus_reward.car_quotation_selected_view
            WHERE (:member IS NULL OR LOWER(CONCAT(member_full_name, ' ', username)) LIKE LOWER(CONCAT('%', :member, '%')))
              AND (:rankId IS NULL OR rank_id = :rankId)
            """)
    Mono<Long> countWithFilters(
            @Param("member") String member,
            @Param("rankId") Long rankId
    );

    @Query("""
            SELECT * FROM bo_bonus_reward.car_quotation_selected_view
            WHERE (:member IS NULL OR LOWER(CONCAT(member_full_name, ' ', username)) LIKE LOWER(CONCAT('%', :member, '%')))
              AND (:rankId IS NULL OR rank_id = :rankId)
            ORDER BY accepted_at DESC
            """)
    Flux<CarQuotationSelectedViewEntity> findAllWithFilters(
            @Param("member") String member,
            @Param("rankId") Long rankId
    );

    @Query("SELECT * FROM bo_bonus_reward.car_quotation_pending_assignment_view")
    Flux<CarQuotationPendingAssignmentViewEntity> getAll();

}