package world.inclub.transfer.liquidation.domain.port;

import reactor.core.publisher.Flux;
import world.inclub.transfer.liquidation.domain.entity.TransferRejectionType;

public interface ITransferRejectionTypePort {
    Flux<TransferRejectionType> getAll();
}
