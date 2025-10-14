package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Mono;

public interface CanModifyRejectedPaymentUseCase {

    Mono<Boolean> canModifyRejectedPayment(Long paymentId);

}
