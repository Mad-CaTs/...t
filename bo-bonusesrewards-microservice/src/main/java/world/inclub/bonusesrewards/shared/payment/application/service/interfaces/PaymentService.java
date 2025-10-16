package world.inclub.bonusesrewards.shared.payment.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.payment.application.dto.MakePaymentCommand;
import world.inclub.bonusesrewards.shared.payment.infrastructure.controllers.dto.response.PaymentResponseDto;

public interface PaymentService {

    Mono<String> processPayment(MakePaymentCommand command);

    Mono<PaymentResponseDto> approvePayment(Long paymentId);

    Mono<PaymentResponseDto> rejectPayment(Long paymentId, String reason, String detail);

}
