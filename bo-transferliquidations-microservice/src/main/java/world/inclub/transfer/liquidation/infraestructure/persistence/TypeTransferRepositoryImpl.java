package world.inclub.transfer.liquidation.infraestructure.persistence;

import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import world.inclub.transfer.liquidation.domain.entity.TypeTransfer;
import world.inclub.transfer.liquidation.domain.port.ITypeTransferPort;
import world.inclub.transfer.liquidation.infraestructure.repository.ITypeTransferRepository;

@Repository
@RequiredArgsConstructor
public class TypeTransferRepositoryImpl implements ITypeTransferPort {
    
    private final ITypeTransferRepository iRepository;

    @Override
    public Flux<TypeTransfer> getAllTypeTransfer() {
        return iRepository.findAll();
    }

}
