package world.inclub.ticket.infraestructure.persistence.repository.r2dbc.payment;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import reactor.core.publisher.Mono;
import world.inclub.ticket.infraestructure.persistence.entity.payment.PaymentRejectionEntity;

public interface R2dbcPaymentRejectionRepository extends R2dbcRepository<PaymentRejectionEntity, Long> {

    @Query("""
                SELECT * 
                FROM payment_rejection 
                WHERE payment_id = :paymentId
                ORDER BY created_at DESC
                LIMIT 1
            """)
    Mono<PaymentRejectionEntity> findByPaymentId(Long paymentId);

}
