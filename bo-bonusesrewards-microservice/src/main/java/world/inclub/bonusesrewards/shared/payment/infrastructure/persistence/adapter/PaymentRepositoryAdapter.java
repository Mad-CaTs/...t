package world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.payment.domain.model.Payment;
import world.inclub.bonusesrewards.shared.payment.domain.port.PaymentRepositoryPort;
import world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.mapper.PaymentEntityMapper;
import world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.repository.PaymentR2dbcRepository;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

import java.time.Instant;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class PaymentRepositoryAdapter implements PaymentRepositoryPort {

    private final PaymentR2dbcRepository paymentRepository;
    private final PaymentEntityMapper paymentEntityMapper;

    @Override
    public Mono<Payment> save(Payment entity) {
        return paymentRepository.save(paymentEntityMapper.toEntity(entity))
                .map(paymentEntityMapper::toDomain);
    }

    @Override
    public Mono<Payment> findById(UUID id) {
        return paymentRepository.findById(id)
                .map(paymentEntityMapper::toDomain);
    }
}
