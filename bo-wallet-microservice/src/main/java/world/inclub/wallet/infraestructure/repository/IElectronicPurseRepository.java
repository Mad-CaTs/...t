

package world.inclub.wallet.infraestructure.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;

import reactor.core.publisher.Flux;
import world.inclub.wallet.domain.entity.ElectronicPurse;

public interface IElectronicPurseRepository extends ReactiveCrudRepository<ElectronicPurse,Long>{

    Flux<ElectronicPurse> findByIdUser (Integer idUser);

}
