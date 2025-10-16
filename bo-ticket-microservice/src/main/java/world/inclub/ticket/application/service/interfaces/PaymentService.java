package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.ticket.application.dto.MakePaymentCommand;
import world.inclub.ticket.api.dto.PaymentResponseDto;

public interface PaymentService {

    Mono<String> processPayment(MakePaymentCommand command);
    
    Mono<PaymentResponseDto> approvePayment(Long paymentId);
    
    Mono<PaymentResponseDto> rejectPayment(Long paymentId, Long reasonId, String detail);
}
