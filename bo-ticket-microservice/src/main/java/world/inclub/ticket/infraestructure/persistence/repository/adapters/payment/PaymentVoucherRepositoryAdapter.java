package world.inclub.ticket.infraestructure.persistence.repository.adapters.payment;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.model.payment.PaymentVoucher;
import world.inclub.ticket.domain.ports.payment.PaymentVoucherRepositoryPort;
import world.inclub.ticket.infraestructure.persistence.mapper.payment.PaymentVoucherEntityMapper;
import world.inclub.ticket.infraestructure.persistence.repository.r2dbc.payment.R2dbcPaymentVoucherRepository;

@Repository
@RequiredArgsConstructor
public class PaymentVoucherRepositoryAdapter implements PaymentVoucherRepositoryPort {

    private final R2dbcPaymentVoucherRepository voucherRepository;
    private final PaymentVoucherEntityMapper voucherEntityMapper;

    @Override
    public Mono<PaymentVoucher> save(PaymentVoucher entity) {
        return voucherRepository.save(voucherEntityMapper.toEntity(entity)).map(voucherEntityMapper::toDomain);
    }

    @Override
    public Mono<PaymentVoucher> findByPaymentId(Long paymentId) {
        return voucherRepository.findByPaymentId(paymentId).map(voucherEntityMapper::toDomain);
    }

}
