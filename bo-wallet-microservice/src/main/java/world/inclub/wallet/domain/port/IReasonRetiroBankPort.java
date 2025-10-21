package world.inclub.wallet.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.domain.entity.ReasonRetiroBank;

public interface IReasonRetiroBankPort {
    public Flux<ReasonRetiroBank> getAllReasonRetiroBank();
    public Mono<ReasonRetiroBank> getIdReasonRetiroBank(long idReasonRetiroBank);
}
