package world.inclub.transfer.liquidation.infraestructure.persistence;

import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import world.inclub.transfer.liquidation.domain.entity.TransferRejectionType;
import world.inclub.transfer.liquidation.domain.port.ITransferRejectionTypePort;
import world.inclub.transfer.liquidation.infraestructure.repository.TransferRejectionTypeRepository;

@Repository
@RequiredArgsConstructor
public class TransferRejectionTypePersistenceAdapter implements ITransferRejectionTypePort {

    private final TransferRejectionTypeRepository repository;

    @Override
    public Flux<TransferRejectionType> getAll() {
        return repository.findAll();
    }
}
