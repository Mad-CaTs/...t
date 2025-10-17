package world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.repository.query.Param;
import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.entity.PaymentVoucherEntity;

import java.util.UUID;

public interface PaymentVoucherR2dbcRepository extends R2dbcRepository<PaymentVoucherEntity, UUID> {

    @Query("""
            SELECT * FROM bo_bonus_reward.payment_vouchers
            WHERE payment_id = :paymentId
            ORDER BY created_at DESC
            """)
    Flux<PaymentVoucherEntity> findByPaymentId(@Param("paymentId") UUID paymentId);
}
