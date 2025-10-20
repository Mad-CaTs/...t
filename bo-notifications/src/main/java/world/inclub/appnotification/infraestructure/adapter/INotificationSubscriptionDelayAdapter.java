package world.inclub.appnotification.infraestructure.adapter;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.appnotification.domain.dto.SubscriptionDelayDTO;
import world.inclub.appnotification.emailMassive.application.dto.UserEmailDTO;
import world.inclub.appnotification.infraestructure.entity.NotificationSubscriptionDelay;

import java.time.LocalDateTime;

public interface INotificationSubscriptionDelayAdapter extends ReactiveCrudRepository<NotificationSubscriptionDelay, Long> {

    @Query("""
        WITH summed_days AS (
            SELECT
                sd.idsubscription,
                SUM(sd.days) AS total_days
            FROM bo_membership.subscription_delay sd
            GROUP BY sd.idsubscription
        ),
    
        max_notified_days AS (
            SELECT
                idsubscription,
                MAX(total_days) AS max_total_days
            FROM bo_notifications.notifications_subscription_delay
            GROUP BY idsubscription
        )    
    
        SELECT
            sd.idsubscription,
            sd.total_days,
            u.id,
            u.name,
            u.lastname,
            u.username,
            u.nrotelf,
            u.email
        FROM summed_days sd
        LEFT JOIN max_notified_days mnd ON sd.idsubscription = mnd.idsubscription
        JOIN bo_membership.suscription s ON sd.idsubscription = s.idsuscription
        JOIN bo_account.user u ON s.iduser = u.id
        WHERE mnd.max_total_days IS NULL
           OR (sd.total_days <> mnd.max_total_days AND mnd.max_total_days < 365)
    """)
    Flux<SubscriptionDelayDTO> findDelayDaysByAllSubscriptions();

    @Query("""
        SELECT p.nextexpirationdate
        FROM bo_membership.payment p
        WHERE p.idsuscription = :idSubscription
            AND p.idstatepayment != 1
        ORDER BY p.positiononschedule
        LIMIT 1;
    """)
    Mono<LocalDateTime> findNextExpirationDateByIdSubscription(Long idSubscription);

    Mono<Boolean> existsByIdSubscriptionAndTotalDays(Long idSubscription, Integer totalDays);

    @Query("""
            select id, email from bo_account."user" where idstate in (1, 16);
            """)
    Flux<UserEmailDTO> findAllEmail();
}
