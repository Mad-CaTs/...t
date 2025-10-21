package world.inclub.wallet.domain.port;

import reactor.core.publisher.Mono;
import world.inclub.wallet.domain.entity.TransactionPaypal;

public interface ITransactionPaypalPort {
    Mono<String> createTransactionPaypal(TransactionPaypal transaction);
}
