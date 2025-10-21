package world.inclub.wallet.domain.port;

import reactor.core.publisher.Mono;
import world.inclub.wallet.domain.entity.ReasonDetailRetiroBank;

public interface IReasonDetailRetiroBankPort {
    public Mono<ReasonDetailRetiroBank> saveReasonDetailRetiroBank(ReasonDetailRetiroBank reasonDetailRetiroBank);
}
