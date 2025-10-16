package world.inclub.ticket.domain.ports.payment;

import reactor.core.publisher.Flux;
import world.inclub.ticket.domain.model.payment.PaymentRejectionReason;

public interface PaymentRejectionReasonRepositoryPort {

    Flux<PaymentRejectionReason> findAll();

}
