package world.inclub.transfer.liquidation.infraestructure.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;
import world.inclub.transfer.liquidation.domain.entity.TransferRejectionType;

public interface TransferRejectionTypeRepository extends ReactiveCrudRepository<TransferRejectionType, Long> {
    Flux<TransferRejectionType> findAll();
}
