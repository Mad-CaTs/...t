package world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.payment.domain.model.PaymentRejection;
import world.inclub.bonusesrewards.shared.payment.domain.port.PaymentRejectionRepositoryPort;
import world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.mapper.PaymentRejectionEntityMapper;
import world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.repository.PaymentRejectionR2dbcRepository;

import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class PaymentRejectionRepositoryAdapter implements PaymentRejectionRepositoryPort {

    private final PaymentRejectionR2dbcRepository paymentRejectionRepository;
    private final PaymentRejectionEntityMapper paymentRejectionEntityMapper;

    @Override
    public Mono<PaymentRejection> save(PaymentRejection paymentRejection) {
        return paymentRejectionRepository.save(paymentRejectionEntityMapper.toEntity(paymentRejection))
                .map(paymentRejectionEntityMapper::toDomain);
    }

    @Override
    public Mono<PaymentRejection> findByPaymentId(UUID paymentId) {
        return paymentRejectionRepository.findByPaymentId(paymentId)
                .map(paymentRejectionEntityMapper::toDomain);
    }
}