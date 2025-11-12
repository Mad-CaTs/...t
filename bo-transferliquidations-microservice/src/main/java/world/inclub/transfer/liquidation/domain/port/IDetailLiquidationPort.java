package world.inclub.transfer.liquidation.domain.port;

import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.domain.entity.DetailLiquidation;

public interface IDetailLiquidationPort {

	public Mono<DetailLiquidation> saveDetailLiquidation(DetailLiquidation entity);
}
