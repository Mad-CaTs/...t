package world.inclub.transfer.liquidation.infraestructure.persistence;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;

import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;
import world.inclub.transfer.liquidation.domain.entity.Suscription;

public interface SuscriptionRepositorylmpl extends ReactiveCrudRepository<Suscription, Integer> {
    Mono<Suscription> findByIdsuscription(Integer idsuscription);
    // Find suscriptions by the user id (column 'iduser' in bo_membership.suscription)
    Flux<Suscription> findByIduser(Integer iduser);
}