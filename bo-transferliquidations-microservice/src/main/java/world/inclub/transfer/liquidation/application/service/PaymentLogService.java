package world.inclub.transfer.liquidation.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.domain.entity.PaymentLog;
import world.inclub.transfer.liquidation.domain.port.IPaymentLogPort;

@Service
@RequiredArgsConstructor
public class PaymentLogService {

    private final IPaymentLogPort paymentLogPort;
    private final world.inclub.transfer.liquidation.infraestructure.persistence.PaymentLogAdapter adapter;

    public Flux<PaymentLog> listBySubscription(Integer idsuscription) {
        return paymentLogPort.findByIdsuscription(idsuscription);
    }

    public Flux<PaymentLog> snapshotAll(Integer idsuscription) {
        return adapter.snapshotAllForSuscription(idsuscription);
    }

    public Mono<PaymentLog> snapshotOne(Integer idPayment) {
        return adapter.snapshotFromPayment(idPayment);
    }
}
