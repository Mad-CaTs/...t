package world.inclub.transfer.liquidation.infraestructure.persistence;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.domain.entity.TransferObservation;
import world.inclub.transfer.liquidation.domain.port.ITransferObservationPort;
import world.inclub.transfer.liquidation.infraestructure.repository.TransferObservationRepository;

@Repository
@RequiredArgsConstructor
public class TransferObservationPersistenceAdapter implements ITransferObservationPort {

    private final TransferObservationRepository repository;

    @Override
    public Flux<TransferObservation> getAll() {
        return repository.findAllOrdered();
    }

    @Override
    public Mono<TransferObservation> insert(TransferObservation observation) {
        return repository.insertReturn(observation.getIdTransferObservationType(), observation.getDetailObservationTransfer(), observation.getIdTransferRequest());
    }
}
