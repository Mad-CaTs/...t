package world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.adapter;

import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.payment.domain.model.Wallet;
import world.inclub.bonusesrewards.shared.payment.domain.port.WalletRepositoryPort;

@Repository
public class WalletRepositoryAdapter implements WalletRepositoryPort {

    @Override
    public Mono<Wallet> getByUserId(Long userId) {
        return Mono.empty();
    }
}
