package world.inclub.bonusesrewards.carbonus.application.usecase.carrankbonus;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.CarRankBonus;

import java.util.UUID;

public interface GetCarRankBonusByQuotationIdUseCase {

    Mono<CarRankBonus> findByQuotationId(UUID quotationId);

}