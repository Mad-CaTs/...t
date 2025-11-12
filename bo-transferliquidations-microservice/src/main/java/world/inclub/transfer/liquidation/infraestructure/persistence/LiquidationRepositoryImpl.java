package world.inclub.transfer.liquidation.infraestructure.persistence;

import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.domain.entity.Liquidation;
import world.inclub.transfer.liquidation.domain.port.ILiquidationPort;
import world.inclub.transfer.liquidation.infraestructure.repository.ILiquidationRepository;

@Repository
@RequiredArgsConstructor
public class LiquidationRepositoryImpl  implements ILiquidationPort {
    
    private final ILiquidationRepository iRepository;
    
    @Override
    public Mono<Liquidation> saveLiquidation(Liquidation entity) {
        return iRepository.save(entity);
    }

    @Override
    public Mono<Void> updateIdStatusById(Liquidation entity){ return iRepository.updateIdStatusById(entity.getIdStatus(), entity.getIdliquidation().intValue(), entity.getModificationDate()); }

}
