package world.inclub.ticket.infraestructure.persistence.repository.r2dbc.payment;

import org.springframework.data.r2dbc.repository.R2dbcRepository;
import reactor.core.publisher.Mono;
import world.inclub.ticket.infraestructure.persistence.entity.payment.PaymentVoucherEntity;

public interface R2dbcPaymentVoucherRepository extends R2dbcRepository<PaymentVoucherEntity, Long> {
    
    /**
     * Busca voucher por ID de pago
     */
    Mono<PaymentVoucherEntity> findByPaymentId(Long paymentId);
}
