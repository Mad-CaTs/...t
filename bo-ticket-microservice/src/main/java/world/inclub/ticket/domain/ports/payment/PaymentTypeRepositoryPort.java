package world.inclub.ticket.domain.ports.payment;

import reactor.core.publisher.Flux;
import world.inclub.ticket.domain.model.payment.PaymentType;

public interface PaymentTypeRepositoryPort {

    Flux<PaymentType> findAllPaymentTypes();

}
