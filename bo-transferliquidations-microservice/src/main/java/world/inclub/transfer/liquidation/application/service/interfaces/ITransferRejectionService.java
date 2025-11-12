package world.inclub.transfer.liquidation.application.service.interfaces;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.api.dtos.TransferRejectionRequest;
import world.inclub.transfer.liquidation.domain.entity.TransferRejection;

public interface ITransferRejectionService {
    Flux<TransferRejection> listTypes();
    Mono<TransferRejection> create(TransferRejectionRequest request);
}
