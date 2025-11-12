package world.inclub.transfer.liquidation.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.api.dtos.StateLiquidationDTO;
import world.inclub.transfer.liquidation.domain.entity.Liquidation;

public interface ILiquidationService {

    public Mono<Liquidation> saveLiquidation(Liquidation entity);
    public Mono<Void> updateIdStatusById(StateLiquidationDTO entity);

}
