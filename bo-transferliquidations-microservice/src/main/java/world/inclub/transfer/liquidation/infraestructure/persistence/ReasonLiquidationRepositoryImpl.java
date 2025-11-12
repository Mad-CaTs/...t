package world.inclub.transfer.liquidation.infraestructure.persistence;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import world.inclub.transfer.liquidation.domain.entity.ReasonLiquidation;
import world.inclub.transfer.liquidation.domain.port.IReasonLiquidationPort;
import world.inclub.transfer.liquidation.infraestructure.repository.IReasonLiquidationRepository;

@Repository
@RequiredArgsConstructor
public class ReasonLiquidationRepositoryImpl implements IReasonLiquidationPort {
    
    private final IReasonLiquidationRepository iRepository;

    @Override
    public Flux<ReasonLiquidation> getAllReasonLiquidation() {
        return iRepository.findAll();
    }

}
