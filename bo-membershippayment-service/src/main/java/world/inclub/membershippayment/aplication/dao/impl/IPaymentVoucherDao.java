package world.inclub.membershippayment.aplication.dao.impl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.aplication.dao.PaymentVoucherDao;
import world.inclub.membershippayment.domain.entity.PaymentVoucher;
import world.inclub.membershippayment.infraestructure.repository.PaymentVoucherRepository;

@Repository("paymentVoucherDao")
@Slf4j
class IPaymentVoucherDao implements PaymentVoucherDao {

    private final PaymentVoucherRepository paymentVoucherRepository;

    public IPaymentVoucherDao(PaymentVoucherRepository paymentVoucherRepository) {
        this.paymentVoucherRepository = paymentVoucherRepository;
    }

    @Override
    public Mono<PaymentVoucher> postPaymentVoucher(PaymentVoucher paymentVoucher) {
        return paymentVoucherRepository.save(paymentVoucher);
    }

    @Override
    public Flux<PaymentVoucher> getAllPaymentVoucher() {
        return paymentVoucherRepository.findAll();
    }

    @Override
    public Mono<PaymentVoucher> getPaymentVoucherById(Long id) {
        return paymentVoucherRepository.findById(id);
    }

    @Override
    public Mono<PaymentVoucher> putPaymentVoucher(PaymentVoucher paymentVoucher) {
        return paymentVoucherRepository.save(paymentVoucher);
    }

    @Override
    public Flux<PaymentVoucher> getPaymentVoucherByIdSuscription(Integer idSuscription) {
        return paymentVoucherRepository.findByIdSuscription(idSuscription);
    }

    @Override
    public Mono<Void> deletePaymentVoucherByIdPayment(Integer idPayment) {
        return paymentVoucherRepository.deleteByIdPayment(idPayment);
    }

    @Override
    public Mono<Void> deletePaymentVoucherByIdPaymentVoucher(Integer idPaymentVoucher) {
        return paymentVoucherRepository.deleteByIdPaymentVoucher(idPaymentVoucher);
    }

}
