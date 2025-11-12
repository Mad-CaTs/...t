package world.inclub.transfer.liquidation.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.domain.entity.TransferRequest;

public interface ITransferRequestPort {
    Mono<TransferRequest> save(TransferRequest request);
    Mono<TransferRequest> findById(Integer id);
    Flux<TransferRequest> findAll();
    Flux<TransferRequest> findByIdTransferStatus(Integer status);
    Flux<TransferRequest> findByUsername(String username);
    Flux<TransferRequest> findByIdTransferType(Integer idTransferType);
}
