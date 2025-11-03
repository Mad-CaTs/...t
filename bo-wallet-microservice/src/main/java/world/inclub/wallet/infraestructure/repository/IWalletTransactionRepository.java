package world.inclub.wallet.infraestructure.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;

import reactor.core.publisher.Flux;
import world.inclub.wallet.domain.entity.WalletTransaction;

public interface IWalletTransactionRepository  extends ReactiveCrudRepository<WalletTransaction,Long>{

    Flux<WalletTransaction> findAllByIdWallet(Long idWallet);

}
