package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.repository.query.Param;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarBonusApplicationDetailViewEntity;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public interface CarBonusApplicationDetailR2dbcRepository
        extends R2dbcRepository<CarBonusApplicationDetailViewEntity, UUID> {

    @Query("""
            SELECT * FROM bo_bonus_reward.car_bonus_applications_details_view
            WHERE (:member IS NULL OR LOWER(CONCAT(member_full_name, ' ', username)) LIKE LOWER(CONCAT('%', :member, '%')))
                AND (:appliedDate IS NULL OR applied_date::date = :appliedDate::date)
                AND (:bonusAmount IS NULL OR bonus_amount = :bonusAmount)
                AND (:onlyInitial IS NULL OR is_initial = :onlyInitial)
            ORDER BY applied_date DESC
            LIMIT :limit OFFSET :offset
            """)
    Flux<CarBonusApplicationDetailViewEntity> findWithFilters(
            @Param("member") String member,
            @Param("appliedDate") Instant appliedDate,
            @Param("bonusAmount") BigDecimal bonusAmount,
            @Param("onlyInitial") Boolean onlyInitial,
            @Param("limit") Integer limit,
            @Param("offset") Integer offset
    );

    @Query("""
            SELECT COUNT(*) FROM bo_bonus_reward.car_bonus_applications_details_view
            WHERE (:member IS NULL OR LOWER(CONCAT(member_full_name, ' ', username)) LIKE LOWER(CONCAT('%', :member, '%')))
                AND (:appliedDate IS NULL OR applied_date::date = :appliedDate::date)
                AND (:bonusAmount IS NULL OR bonus_amount = :bonusAmount)
                AND (:onlyInitial IS NULL OR is_initial = :onlyInitial)
            """)
    Mono<Long> countWithFilters(
            @Param("member") String member,
            @Param("appliedDate") Instant appliedDate,
            @Param("bonusAmount") BigDecimal bonusAmount,
            @Param("onlyInitial") Boolean onlyInitial
    );

    @Query("""
            SELECT * FROM bo_bonus_reward.car_bonus_applications_details_view
            WHERE (:member IS NULL OR LOWER(CONCAT(member_full_name, ' ', username)) LIKE LOWER(CONCAT('%', :member, '%')))
                AND (:appliedDate IS NULL OR applied_date::date = :appliedDate::date)
                AND (:bonusAmount IS NULL OR bonus_amount = :bonusAmount)
                AND (:onlyInitial IS NULL OR is_initial = :onlyInitial)
            ORDER BY applied_date DESC
            """)
    Flux<CarBonusApplicationDetailViewEntity> findAllWithFilters(
            @Param("member") String member,
            @Param("appliedDate") Instant appliedDate,
            @Param("bonusAmount") BigDecimal bonusAmount,
            @Param("onlyInitial") Boolean onlyInitial
    );

}