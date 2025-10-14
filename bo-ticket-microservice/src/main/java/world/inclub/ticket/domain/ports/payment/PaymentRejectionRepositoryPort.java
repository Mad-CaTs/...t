package world.inclub.ticket.domain.ports.payment;

import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.model.payment.PaymentRejection;

public interface PaymentRejectionRepositoryPort {

    Mono<PaymentRejection> save(PaymentRejection paymentRejection);
    
    Mono<PaymentRejection> findByPaymentId(Long paymentId);

}
