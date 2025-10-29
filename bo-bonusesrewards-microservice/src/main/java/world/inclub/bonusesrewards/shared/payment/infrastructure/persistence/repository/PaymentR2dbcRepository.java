package world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.repository;

import org.springframework.data.r2dbc.repository.R2dbcRepository;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.entity.PaymentEntity;

import java.util.UUID;

public interface PaymentR2dbcRepository extends R2dbcRepository<PaymentEntity, UUID> {
    Mono<PaymentEntity> findBySourceRecordId(UUID sourceRecordId);
}
