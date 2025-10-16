package world.inclub.bonusesrewards.shared.payment.domain.port;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.payment.domain.model.Payment;

import java.util.UUID;

public interface PaymentRepositoryPort {

    Mono<Payment> findById(UUID id);

    Mono<Payment> save(Payment payment);
}
