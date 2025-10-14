package world.inclub.ticket.domain.ports.payment;

import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.model.PaymentSubType;

public interface PaymentSubTypeRepositoryPort {

    Mono<PaymentSubType> findById(Integer id);

}
