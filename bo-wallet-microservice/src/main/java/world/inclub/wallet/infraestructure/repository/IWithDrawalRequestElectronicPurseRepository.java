package world.inclub.wallet.infraestructure.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;

import world.inclub.wallet.domain.entity.WithDrawalRequestElectronicPurse;

public interface IWithDrawalRequestElectronicPurseRepository extends ReactiveCrudRepository<WithDrawalRequestElectronicPurse,Long>{

}
