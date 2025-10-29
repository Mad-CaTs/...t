package world.inclub.bonusesrewards.shared.payment.application.usecase;

import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.shared.payment.api.dto.PaymentRejectionReasonResponseDto;

public interface GetAllPaymentRejectionReasonsUseCase {
    Flux<PaymentRejectionReasonResponseDto> getAllPaymentRejectionReasons();
}
