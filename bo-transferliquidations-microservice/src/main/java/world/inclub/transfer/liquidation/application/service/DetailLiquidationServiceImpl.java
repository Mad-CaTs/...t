package world.inclub.transfer.liquidation.application.service;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.application.service.interfaces.IDetailLiquidationService;
import world.inclub.transfer.liquidation.domain.entity.DetailLiquidation;
import world.inclub.transfer.liquidation.domain.port.IDetailLiquidationPort;

@Service
@RequiredArgsConstructor
public class DetailLiquidationServiceImpl implements IDetailLiquidationService {
    
    private final IDetailLiquidationPort iDetailTransferPort;
    
    @Override
    public Mono<DetailLiquidation> saveDetailLiquidation(DetailLiquidation entity) {
        return iDetailTransferPort.saveDetailLiquidation(entity);
    }

}
