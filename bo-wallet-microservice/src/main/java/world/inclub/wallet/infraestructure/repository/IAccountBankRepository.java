package world.inclub.wallet.infraestructure.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;

import reactor.core.publisher.Flux;
import world.inclub.wallet.domain.entity.AccountBank;


public interface IAccountBankRepository extends ReactiveCrudRepository<AccountBank,Long> {

    public Flux<AccountBank> findByIdUser (Integer idUser);

}
