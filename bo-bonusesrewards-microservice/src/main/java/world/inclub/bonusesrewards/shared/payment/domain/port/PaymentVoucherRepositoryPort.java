package world.inclub.bonusesrewards.shared.payment.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.payment.domain.model.PaymentVoucher;

import java.util.UUID;

public interface PaymentVoucherRepositoryPort {

    Flux<PaymentVoucher> findByPaymentId(UUID paymentId);

    Mono<PaymentVoucher> save(PaymentVoucher voucher);
}
