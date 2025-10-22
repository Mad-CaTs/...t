package world.inclub.membershippayment.infraestructure.repository;

import java.util.List;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.domain.dto.response.SubscriptionDelayDTO;
import world.inclub.membershippayment.domain.entity.SubscriptionDelay;

@Repository
public interface SubscriptionDelayRepository extends ReactiveCrudRepository<SubscriptionDelay, Long> {

    Mono<Boolean> existsByIdPaymentAndIdSubscription(Long idPayment, Long idSubscription);
    @Query("""
        SELECT
            COALESCE(SUM(sd.days), 0) AS days,
            MAX(sd.paymentdate) AS liquidation_date,
            s.status AS status
        FROM bo_membership.suscription s
            LEFT JOIN bo_membership.subscription_delay sd ON s.idsuscription = sd.idsubscription
        WHERE s.idsuscription = :idSubscription
        GROUP BY s.status;
    """)
    Mono<SubscriptionDelayDTO> findDelayDaysByIdSubscription(Integer idSubscription);

}
