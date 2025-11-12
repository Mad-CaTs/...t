package world.inclub.transfer.liquidation.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.domain.entity.PaymentLog;

public interface IPaymentLogPort {
    Flux<PaymentLog> findByIdsuscription(Integer idsuscription);
    Mono<PaymentLog> insert(PaymentLog log);
}
