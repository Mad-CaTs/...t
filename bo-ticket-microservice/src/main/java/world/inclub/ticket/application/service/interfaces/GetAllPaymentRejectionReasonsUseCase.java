package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Flux;
import world.inclub.ticket.api.dto.PaymentRejectionReasonResponseDto;

public interface GetAllPaymentRejectionReasonsUseCase {

    Flux<PaymentRejectionReasonResponseDto> getAllPaymentRejectionReasons();

}
