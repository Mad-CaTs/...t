package world.inclub.transfer.liquidation.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.domain.entity.DetailLiquidation;

public interface IDetailLiquidationService {

    public Mono<DetailLiquidation> saveDetailLiquidation(DetailLiquidation entity);

}
