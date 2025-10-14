package world.inclub.bonusesrewards.carbonus.application.usecase.carrankbonus;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.CarRankBonus;

public interface GetCarRankBonusByMemberIdUseCase {

    Mono<CarRankBonus> getByMemberId(Long memberId);

}