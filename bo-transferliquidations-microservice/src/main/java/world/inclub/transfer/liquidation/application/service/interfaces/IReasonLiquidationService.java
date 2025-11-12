package world.inclub.transfer.liquidation.application.service.interfaces;

import reactor.core.publisher.Flux;
import world.inclub.transfer.liquidation.domain.entity.ReasonLiquidation;

public interface IReasonLiquidationService {

    public Flux<ReasonLiquidation> getAllReasonLiquidation();

}
