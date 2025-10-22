package world.inclub.bonusesrewards.shared.wallet.domain.port;

import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.shared.wallet.domain.model.WalletTransaction;

public interface WalletTransactionRepositoryPort {
    Flux<WalletTransaction> saveAll(Iterable<WalletTransaction> transactions);
}
