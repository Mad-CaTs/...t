package world.inclub.wallet.application.service.interfaces;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.domain.entity.ReasonRetiroBank;

public interface IReasonRetiroBankService {
    public Flux<ReasonRetiroBank> getAllReasonRetiroBank();
    public  Mono<ReasonRetiroBank> getIdReasonRetiroBank(long idReasonRetiroBank);
}
