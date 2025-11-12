package world.inclub.transfer.liquidation.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import world.inclub.transfer.liquidation.application.service.interfaces.IReasonLiquidationService;
import world.inclub.transfer.liquidation.domain.entity.ReasonLiquidation;
import world.inclub.transfer.liquidation.domain.port.IReasonLiquidationPort;

@Service
@RequiredArgsConstructor
public class ReasonLiquidationServiceImpl implements IReasonLiquidationService {
    
    private final IReasonLiquidationPort iport;

    @Override
    public Flux<ReasonLiquidation> getAllReasonLiquidation() {
        return iport.getAllReasonLiquidation();
    }

}
