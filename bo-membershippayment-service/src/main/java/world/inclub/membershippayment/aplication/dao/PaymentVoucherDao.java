package world.inclub.membershippayment.aplication.dao;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.domain.entity.PaymentVoucher;

public interface PaymentVoucherDao {
    Mono<PaymentVoucher> postPaymentVoucher(PaymentVoucher paymentVoucher);

    Flux<PaymentVoucher> getAllPaymentVoucher();

    Mono<PaymentVoucher> getPaymentVoucherById(Long id);

    // actualiza el comprobante de pago
    Mono<PaymentVoucher> putPaymentVoucher(PaymentVoucher paymentVoucher);

    Flux<PaymentVoucher> getPaymentVoucherByIdSuscription(Integer idSuscription);

    Mono<Void> deletePaymentVoucherByIdPayment(Integer idPayment);

    Mono<Void> deletePaymentVoucherByIdPaymentVoucher(Integer idPaymentVoucher);
}
