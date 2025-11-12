package world.inclub.transfer.liquidation.infraestructure.persistence;

import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.domain.entity.DetailLiquidation;
import world.inclub.transfer.liquidation.domain.port.IDetailLiquidationPort;
import world.inclub.transfer.liquidation.infraestructure.repository.IDetailLiquidationRepository;

@Repository
@RequiredArgsConstructor
public class DetailLiquidationRepositoryImpl  implements IDetailLiquidationPort {
    
    private final IDetailLiquidationRepository iRepository;
    
    @Override
    public Mono<DetailLiquidation> saveDetailLiquidation(DetailLiquidation entity) {
        return iRepository.save(entity);
    }

}
