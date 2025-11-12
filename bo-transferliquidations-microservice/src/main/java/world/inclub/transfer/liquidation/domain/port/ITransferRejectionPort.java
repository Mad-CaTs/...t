package world.inclub.transfer.liquidation.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.domain.entity.TransferRejection;

public interface ITransferRejectionPort {
    Flux<TransferRejection> getAll();
    Mono<TransferRejection> insert(TransferRejection rejection);
}
