package world.inclub.transfer.liquidation.infraestructure.persistence;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.domain.entity.TransferRejection;
import world.inclub.transfer.liquidation.domain.port.ITransferRejectionPort;
import world.inclub.transfer.liquidation.infraestructure.repository.TransferRejectionRepository;

@Repository
@RequiredArgsConstructor
public class TransferRejectionPersistenceAdapter implements ITransferRejectionPort {

    private final TransferRejectionRepository repository;

    @Override
    public Flux<TransferRejection> getAll() {
        return repository.findAllOrdered();
    }

    @Override
    public Mono<TransferRejection> insert(TransferRejection rejection) {
        return repository.insertReturn(rejection.getIdTransferRequest(), rejection.getIdTransferRejectionType(), rejection.getDetailRejectionTransfer());
    }
}
