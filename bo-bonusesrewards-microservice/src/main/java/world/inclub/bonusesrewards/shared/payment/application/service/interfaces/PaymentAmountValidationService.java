package world.inclub.bonusesrewards.shared.payment.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.payment.application.dto.MakePaymentCommand;

public interface PaymentAmountValidationService {

    Mono<MakePaymentCommand> validateAmounts(MakePaymentCommand command);
}
