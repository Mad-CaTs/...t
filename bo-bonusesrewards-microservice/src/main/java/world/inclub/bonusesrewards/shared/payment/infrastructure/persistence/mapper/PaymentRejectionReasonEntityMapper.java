package world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.payment.domain.model.PaymentRejectionReason;
import world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.entity.PaymentRejectionReasonEntity;

@Component
public class PaymentRejectionReasonEntityMapper {

    public PaymentRejectionReason toDomain(PaymentRejectionReasonEntity entity) {
        if (entity == null) return null;
        return new PaymentRejectionReason(
                entity.getReasonId(),
                entity.getReason()
        );
    }
}
