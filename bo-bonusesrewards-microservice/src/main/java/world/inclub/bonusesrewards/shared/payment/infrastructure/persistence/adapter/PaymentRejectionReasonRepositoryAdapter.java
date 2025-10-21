package world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.payment.domain.model.PaymentRejectionReason;
import world.inclub.bonusesrewards.shared.payment.domain.port.PaymentRejectionReasonRepositoryPort;
import world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.mapper.PaymentRejectionReasonEntityMapper;
import world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.repository.PaymentRejectionReasonR2dbcRepository;

@Repository
@RequiredArgsConstructor
public class PaymentRejectionReasonRepositoryAdapter implements PaymentRejectionReasonRepositoryPort {

    private final PaymentRejectionReasonR2dbcRepository repository;
    private final PaymentRejectionReasonEntityMapper mapper;

    @Override
    public Mono<PaymentRejectionReason> findById(Long reasonId) {
        return repository.findById(reasonId)
                .map(mapper::toDomain);
    }
}
