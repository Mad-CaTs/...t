package world.inclub.bonusesrewards.shared.wallet.domain.port;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.wallet.domain.model.Wallet;

public interface WalletRepositoryPort {
    Mono<Wallet> save(Wallet wallet);

    Mono<Wallet> findByMemberId(Long memberId);
}
