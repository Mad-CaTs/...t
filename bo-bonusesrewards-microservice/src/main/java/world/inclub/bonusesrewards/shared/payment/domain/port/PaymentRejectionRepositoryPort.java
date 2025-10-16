package world.inclub.bonusesrewards.shared.payment.domain.port;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.payment.domain.model.PaymentRejection;

import java.util.UUID;

public interface PaymentRejectionRepositoryPort {

    Mono<PaymentRejection> save(PaymentRejection paymentRejection);

    Mono<PaymentRejection> findByPaymentId(UUID paymentId);
}
