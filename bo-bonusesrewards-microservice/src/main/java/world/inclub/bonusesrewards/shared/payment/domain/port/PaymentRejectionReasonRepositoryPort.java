package world.inclub.bonusesrewards.shared.payment.domain.port;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.payment.domain.model.PaymentRejectionReason;

public interface PaymentRejectionReasonRepositoryPort {
    Mono<PaymentRejectionReason> findById(Long reasonId);

}
