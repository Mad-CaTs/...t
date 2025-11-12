package world.inclub.transfer.liquidation.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.domain.entity.TransferObservation;

public interface ITransferObservationPort {
    Flux<TransferObservation> getAll();
    Mono<TransferObservation> insert(TransferObservation observation);
}
