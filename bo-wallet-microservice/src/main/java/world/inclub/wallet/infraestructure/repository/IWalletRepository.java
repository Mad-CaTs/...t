package world.inclub.wallet.infraestructure.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;

import reactor.core.publisher.Mono;
import world.inclub.wallet.domain.entity.Wallet;




public interface IWalletRepository extends ReactiveCrudRepository<Wallet,Long>{

    public Mono<Wallet> findByIdUser(int idUser);

}



