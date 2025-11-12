package world.inclub.transfer.liquidation.application.service.interfaces;

import java.util.Map;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.api.dtos.TransferObservationRequest;
import world.inclub.transfer.liquidation.domain.entity.TransferObservation;

public interface ITransferObservationService {
    Flux<TransferObservation> listTypes();
    Mono<TransferObservation> create(TransferObservationRequest request);
    Mono<Map<String, Object>> createWithEnrichedTransfer(TransferObservationRequest request);
}
