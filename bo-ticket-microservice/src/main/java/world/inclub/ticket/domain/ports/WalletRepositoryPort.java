package world.inclub.ticket.domain.ports;

import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.model.Wallet;

public interface WalletRepositoryPort {

    Mono<Wallet> getByUserId(Long userId);

}
