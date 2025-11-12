package world.inclub.transfer.liquidation.infraestructure.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.domain.entity.TransferOldUser;

public interface ITransferOldUserRepository extends ReactiveCrudRepository<TransferOldUser, Integer> {
    Mono<TransferOldUser> save(TransferOldUser entity);
}
