package world.inclub.bonusesrewards.shared.payment.domain.port;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.payment.domain.model.Wallet;

public interface WalletRepositoryPort {

    Mono<Wallet> getByUserId(Long userId);

}
