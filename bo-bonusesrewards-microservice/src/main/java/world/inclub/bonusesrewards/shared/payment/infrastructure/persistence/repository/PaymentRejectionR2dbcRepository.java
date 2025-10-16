package world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.repository.query.Param;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.entity.PaymentRejectionEntity;

import java.util.UUID;

public interface PaymentRejectionR2dbcRepository extends R2dbcRepository<PaymentRejectionEntity, Long> {

    @Query("""
            SELECT * 
            FROM bo_bonus_reward.payment_rejection 
            WHERE payment_id = :paymentId
            ORDER BY created_at DESC
            LIMIT 1
            """)
    Mono<PaymentRejectionEntity> findByPaymentId(@Param("paymentId") UUID paymentId);
}
