package world.inclub.ticket.domain.ports.payment;

import reactor.core.publisher.Flux;
import world.inclub.ticket.domain.model.payment.PaymentDetail;

import java.util.Collection;

public interface PaymentDetailRepositoryPort {

    /**
     * Save a PaymentDetail entity.
     *
     * @param detail the PaymentDetail to save
     * @return a Mono emitting the saved PaymentDetail
     */
    Flux<PaymentDetail> saveAll(Collection<PaymentDetail> detail);

}
