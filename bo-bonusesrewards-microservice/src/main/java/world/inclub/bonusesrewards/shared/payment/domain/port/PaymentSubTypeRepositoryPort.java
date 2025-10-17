package world.inclub.bonusesrewards.shared.payment.domain.port;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.payment.domain.model.PaymentSubType;

public interface PaymentSubTypeRepositoryPort {

    Mono<PaymentSubType> findById(Integer id);
}
