package world.inclub.transfer.liquidation.infraestructure.persistence;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.domain.entity.TransferRequest;
import world.inclub.transfer.liquidation.domain.port.ITransferRequestPort;
import world.inclub.transfer.liquidation.infraestructure.repository.ITransferRequestRepository;

@Component
@RequiredArgsConstructor
public class TransferRequestAdapter implements ITransferRequestPort {

    private final ITransferRequestRepository repository;

    @Override
    public Mono<TransferRequest> save(TransferRequest request) {
        return repository.save(request);
    }

    @Override
    public Mono<TransferRequest> findById(Integer id) {
        return repository.findById(id);
    }

    @Override
    public Flux<TransferRequest> findAll() {
        return repository.findAllBy();
    }

    @Override
    public Flux<TransferRequest> findByIdTransferStatus(Integer status) {
        return repository.findByIdTransferStatus(status);
    }

    @Override
    public Flux<TransferRequest> findByUsername(String username) {
        // search across username_from, username_to and username_child fields
        return repository.findByUsernameFromOrUsernameToOrUsernameChild(username, username, username);
    }

    @Override
    public Flux<TransferRequest> findByIdTransferType(Integer idTransferType) {
        return repository.findByIdTransferType(idTransferType);
    }
}
