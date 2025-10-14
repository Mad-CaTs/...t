package world.inclub.ticket.application.port;

import reactor.core.publisher.Mono;
import world.inclub.ticket.application.dto.ProcessWalletPaymentCommand;

public interface WalletPaymentService {

    Mono<Void> sendWalletPayment(ProcessWalletPaymentCommand command);

}
