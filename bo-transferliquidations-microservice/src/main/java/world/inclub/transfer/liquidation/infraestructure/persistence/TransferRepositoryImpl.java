package world.inclub.transfer.liquidation.infraestructure.persistence;

import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.domain.entity.Transfer;
import world.inclub.transfer.liquidation.domain.port.ITransferPort;
import world.inclub.transfer.liquidation.infraestructure.repository.ITransferRepository;

@Repository
@RequiredArgsConstructor
public class TransferRepositoryImpl  implements ITransferPort {
    
    private final ITransferRepository iRepository;
    
    @Override
    public Mono<Transfer> saveTransfer(Transfer entity) {
        return iRepository.save(entity);
    }

    @Override
    public Mono<Void> updateIdStatusById(Transfer entity){ return iRepository.updateIdStatusById(entity.getIdStatus(), entity.getIdTransfer(), entity.getModificationDate()); }

}
