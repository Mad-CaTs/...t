package world.inclub.transfer.liquidation.domain.port;

import reactor.core.publisher.Flux;
import world.inclub.transfer.liquidation.domain.entity.ReasonLiquidation;

public interface IReasonLiquidationPort {

	public Flux<ReasonLiquidation> getAllReasonLiquidation();

}
