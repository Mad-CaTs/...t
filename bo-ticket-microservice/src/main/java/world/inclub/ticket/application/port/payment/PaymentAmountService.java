package world.inclub.ticket.application.port.payment;

import reactor.core.publisher.Mono;
import world.inclub.ticket.application.dto.MakePaymentCommand;
import world.inclub.ticket.application.dto.PaymentAmounts;

public interface PaymentAmountService {

    Mono<PaymentAmounts> validateAndCalculate(MakePaymentCommand command);

}
