package world.inclub.ticket.domain.ports.payment;

import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.model.payment.PaymentVoucher;

public interface PaymentVoucherRepositoryPort {

    Mono<PaymentVoucher> save(PaymentVoucher paymentVoucher);
    
    /**
     * Busca voucher por ID de pago
     */
    Mono<PaymentVoucher> findByPaymentId(Long paymentId);
}
