package world.inclub.bonusesrewards.shared.notification.infrastructure.persistence.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.notification.infrastructure.persistence.entity.NotificationEntity;

import java.util.UUID;

@Repository
public interface NotificationR2dbcRepository
        extends R2dbcRepository<NotificationEntity, UUID> {

    @Query("""
            SELECT * FROM bo_bonus_reward.notifications
            WHERE member_id = :memberId
            ORDER BY created_at DESC
            LIMIT :limit
            """)
    Flux<NotificationEntity> findLatestByMemberId(Long memberId, int limit);

    @Query("""
            UPDATE     bo_bonus_reward.notifications
            SET        is_read = TRUE,
                       read_at = NOW()
            WHERE      id = :id
            RETURNING  *
            """)
    Mono<NotificationEntity> markAsRead(UUID id);

}