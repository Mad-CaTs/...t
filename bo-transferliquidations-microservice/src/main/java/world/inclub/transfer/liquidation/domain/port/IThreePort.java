package world.inclub.transfer.liquidation.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.domain.entity.Three;

public interface IThreePort {
    Mono<Three> findSponsorByIdMaster(Integer masterId);
    Flux<Three> findAllSponsorTrees();
}
