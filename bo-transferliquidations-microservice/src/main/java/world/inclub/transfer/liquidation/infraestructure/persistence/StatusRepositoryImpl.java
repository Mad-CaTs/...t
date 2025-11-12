package world.inclub.transfer.liquidation.infraestructure.persistence;

import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import world.inclub.transfer.liquidation.domain.entity.Status;
import world.inclub.transfer.liquidation.domain.port.IStatusPort;
import world.inclub.transfer.liquidation.infraestructure.repository.IStatusRepository;

@Repository
@RequiredArgsConstructor
public class StatusRepositoryImpl  implements IStatusPort{
    
    private final IStatusRepository iRepository;
    
    @Override
    public Flux<Status> getAllStatus() {
        return iRepository.findAll();
    }

}
