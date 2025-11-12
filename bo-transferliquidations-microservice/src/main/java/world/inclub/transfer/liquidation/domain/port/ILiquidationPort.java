package world.inclub.transfer.liquidation.domain.port;

import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.domain.entity.Liquidation;

public interface ILiquidationPort {

	public Mono<Liquidation> saveLiquidation(Liquidation entity);
	public Mono<Void> updateIdStatusById(Liquidation entity);
}
