package world.inclub.transfer.liquidation.infraestructure.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.domain.entity.TransferRequest;

public interface ITransferRequestRepository extends ReactiveCrudRepository<TransferRequest, Integer> {
    Mono<TransferRequest> findById(Integer id);
    Flux<TransferRequest> findAllBy();
    Flux<TransferRequest> findByIdTransferStatus(Integer idTransferStatus);
    Flux<TransferRequest> findByIdTransferType(Integer idTransferType);
    // Find transfer requests where any of the username fields match the provided username
    Flux<TransferRequest> findByUsernameFromOrUsernameToOrUsernameChild(String usernameFrom, String usernameTo, String usernameChild);
}
