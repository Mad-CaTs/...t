package world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.repository;

import org.springframework.data.r2dbc.repository.R2dbcRepository;
import world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.entity.PaymentRejectionReasonEntity;

public interface PaymentRejectionReasonR2dbcRepository extends R2dbcRepository<PaymentRejectionReasonEntity, Long> {
}
