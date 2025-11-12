package world.inclub.transfer.liquidation.infraestructure.persistence;

import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import world.inclub.transfer.liquidation.domain.entity.TransferObservationType;
import world.inclub.transfer.liquidation.domain.port.ITransferObservationTypePort;
import world.inclub.transfer.liquidation.infraestructure.repository.TransferObservationTypeRepository;

@Repository
@RequiredArgsConstructor
public class TransferObservationTypePersistenceAdapter implements ITransferObservationTypePort {

    private final TransferObservationTypeRepository repository;

    @Override
    public Flux<TransferObservationType> getAll() {
        return repository.findAll();
    }
}
