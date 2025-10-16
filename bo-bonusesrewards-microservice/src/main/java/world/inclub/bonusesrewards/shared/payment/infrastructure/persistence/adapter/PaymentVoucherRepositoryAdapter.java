package world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.payment.domain.model.PaymentVoucher;
import world.inclub.bonusesrewards.shared.payment.domain.port.PaymentVoucherRepositoryPort;
import world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.mapper.PaymentVoucherEntityMapper;
import world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.repository.PaymentVoucherR2dbcRepository;

import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class PaymentVoucherRepositoryAdapter implements PaymentVoucherRepositoryPort {

    private final PaymentVoucherR2dbcRepository voucherRepository;
    private final PaymentVoucherEntityMapper voucherEntityMapper;

    @Override
    public Mono<PaymentVoucher> save(PaymentVoucher entity) {
        return voucherRepository.save(voucherEntityMapper.toEntity(entity))
                .map(voucherEntityMapper::toDomain);
    }

    @Override
    public Flux<PaymentVoucher> findByPaymentId(UUID paymentId) {
        return voucherRepository.findByPaymentId(paymentId)
                .map(voucherEntityMapper::toDomain);
    }
}
