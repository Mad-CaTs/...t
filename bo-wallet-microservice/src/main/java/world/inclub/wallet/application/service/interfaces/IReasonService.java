package world.inclub.wallet.application.service.interfaces;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.domain.entity.Reason;

public interface IReasonService {

    Mono<Reason> saveReason(Reason reason);

    Mono<Reason> findById(Long idReason);

    Flux<Reason> getAllReason();
}
