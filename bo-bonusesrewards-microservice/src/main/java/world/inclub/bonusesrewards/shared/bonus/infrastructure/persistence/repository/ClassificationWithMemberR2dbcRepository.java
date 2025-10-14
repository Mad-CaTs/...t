package world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.repository.query.Param;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.entity.ClassificationWithMemberViewEntity;

import java.util.UUID;

public interface ClassificationWithMemberR2dbcRepository
        extends R2dbcRepository<ClassificationWithMemberViewEntity, UUID> {

    @Query("""
            SELECT * FROM bo_bonus_reward.classifications_with_member_view
            WHERE (:member IS NULL OR LOWER(CONCAT(member_full_name, ' ', username)) LIKE LOWER(CONCAT('%', :member, '%')))
              AND (:rankId IS NULL OR rank_id = :rankId)
              AND (:notificationStatus IS NULL OR notification_status = :notificationStatus)
            ORDER BY classification_date DESC
            """)
    Flux<ClassificationWithMemberViewEntity> findWithFilters(
            @Param("member") String member,
            @Param("rankId") Long rankId,
            @Param("notificationStatus") Boolean notificationStatus
    );


    @Query("""
            SELECT * FROM bo_bonus_reward.classifications_with_member_view
            WHERE (:member IS NULL OR LOWER(CONCAT(member_full_name, ' ', username)) LIKE LOWER(CONCAT('%', :member, '%')))
              AND (:rankId IS NULL OR rank_id = :rankId)
              AND (:notificationStatus IS NULL OR notification_status = :notificationStatus)
            ORDER BY classification_date DESC
            LIMIT :limit OFFSET :offset
            """)
    Flux<ClassificationWithMemberViewEntity> findWithFiltersPageable(
            @Param("member") String member,
            @Param("rankId") Long rankId,
            @Param("notificationStatus") Boolean notificationStatus,
            @Param("limit") Integer limit,
            @Param("offset") Integer offset
    );

    @Query("""
            SELECT COUNT(*) FROM bo_bonus_reward.classifications_with_member_view
            WHERE (:member IS NULL OR LOWER(CONCAT(member_full_name, ' ', username)) LIKE LOWER(CONCAT('%', :member, '%')))
              AND (:rankId IS NULL OR rank_id = :rankId)
              AND (:notificationStatus IS NULL OR notification_status = :notificationStatus)
            """)
    Mono<Long> countWithFilters(
            @Param("member") String member,
            @Param("rankId") Long rankId,
            @Param("notificationStatus") Boolean notificationStatus
    );

}