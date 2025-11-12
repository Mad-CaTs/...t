package world.inclub.transfer.liquidation.infraestructure.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;
import world.inclub.transfer.liquidation.domain.entity.TransferObservationType;

public interface TransferObservationTypeRepository extends ReactiveCrudRepository<TransferObservationType, Long> {
    Flux<TransferObservationType> findAll();
}
