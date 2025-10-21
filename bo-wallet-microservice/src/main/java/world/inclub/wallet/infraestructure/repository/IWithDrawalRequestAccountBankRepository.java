package world.inclub.wallet.infraestructure.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;

import world.inclub.wallet.domain.entity.WithDrawalRequestAccountBank;


public interface IWithDrawalRequestAccountBankRepository  extends ReactiveCrudRepository<WithDrawalRequestAccountBank,Long> {

}
