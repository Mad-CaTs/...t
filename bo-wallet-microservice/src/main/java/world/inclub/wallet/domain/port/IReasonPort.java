package world.inclub.wallet.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.domain.entity.Reason;

public interface IReasonPort {

    Mono<Reason> saveReason(Reason reason);

    Mono<Reason> finByIdReason(Long idReason);

    Flux<Reason> getAllReasons();
}
