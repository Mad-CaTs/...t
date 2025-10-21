package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.repository.query.Param;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarQuotationSummaryViewEntity;

import java.util.UUID;

public interface CarQuotationSummaryR2dbcRepository
        extends R2dbcRepository<CarQuotationSummaryViewEntity, UUID> {

    @Query("""
            SELECT * FROM bo_bonus_reward.car_quotation_summary_view
            WHERE (:member IS NULL OR LOWER(CONCAT(member_full_name, ' ', username)) LIKE LOWER(CONCAT('%', :member, '%')))
              AND (:rankId IS NULL OR rank_id = :rankId)
              AND (:isReviewed IS NULL OR has_any_accepted = :isReviewed)
            ORDER BY last_quotation_date DESC
            LIMIT :limit OFFSET :offset
            """)
    Flux<CarQuotationSummaryViewEntity> findWithFilters(
            @Param("member") String member,
            @Param("rankId") Long rankId,
            @Param("isReviewed") Boolean isReviewed,
            @Param("limit") Integer limit,
            @Param("offset") Integer offset
    );

    @Query("""
            SELECT COUNT(*) FROM bo_bonus_reward.car_quotation_summary_view
            WHERE (:member IS NULL OR LOWER(CONCAT(member_full_name, ' ', username)) LIKE LOWER(CONCAT('%', :member, '%')))
              AND (:rankId IS NULL OR rank_id = :rankId)
              AND (:isReviewed IS NULL OR has_any_accepted = :isReviewed)
            """)
    Mono<Long> countWithFilters(
            @Param("member") String member,
            @Param("rankId") Long rankId,
            @Param("isReviewed") Boolean isReviewed
    );

    @Query("""
            SELECT * FROM bo_bonus_reward.car_quotation_summary_view
            WHERE (:member IS NULL OR LOWER(CONCAT(member_full_name, ' ', username)) LIKE LOWER(CONCAT('%', :member, '%')))
              AND (:rankId IS NULL OR rank_id = :rankId)
              AND (:isReviewed IS NULL OR has_any_accepted = :isReviewed)
            ORDER BY last_quotation_date DESC
            """)
    Flux<CarQuotationSummaryViewEntity> findAllWithFilters(
            @Param("member") String member,
            @Param("rankId") Long rankId,
            @Param("isReviewed") Boolean isReviewed
    );

}
