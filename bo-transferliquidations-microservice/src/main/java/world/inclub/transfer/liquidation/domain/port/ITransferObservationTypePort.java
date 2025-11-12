package world.inclub.transfer.liquidation.domain.port;

import reactor.core.publisher.Flux;
import world.inclub.transfer.liquidation.domain.entity.TransferObservationType;

public interface ITransferObservationTypePort {
    Flux<TransferObservationType> getAll();
}
