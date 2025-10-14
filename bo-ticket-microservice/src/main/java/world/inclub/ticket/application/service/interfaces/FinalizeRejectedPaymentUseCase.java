package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Mono;

public interface FinalizeRejectedPaymentUseCase {
    Mono<Void> finalizeRejectedPayment(Long paymentId, Long reasonId, String detail);
}
