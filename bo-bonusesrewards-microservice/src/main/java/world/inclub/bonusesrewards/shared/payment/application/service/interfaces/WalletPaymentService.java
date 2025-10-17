package world.inclub.bonusesrewards.shared.payment.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.payment.application.dto.ProcessWalletPaymentCommand;

public interface WalletPaymentService {

    Mono<Void> sendWalletPayment(ProcessWalletPaymentCommand command);

}
