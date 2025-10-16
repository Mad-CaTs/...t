package world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.payment.domain.model.PaymentRejection;
import world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.entity.PaymentRejectionEntity;

@Component
public class PaymentRejectionEntityMapper {

    public PaymentRejection toDomain(PaymentRejectionEntity entity) {
        if (entity == null) return null;
        return PaymentRejection.builder()
                .id(entity.getId())
                .paymentId(entity.getPaymentId())
                .reasonId(entity.getReasonId())
                .note(entity.getNote())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    public PaymentRejectionEntity toEntity(PaymentRejection domain) {
        return PaymentRejectionEntity.builder()
                .id(domain.getId())
                .paymentId(domain.getPaymentId())
                .reasonId(domain.getReasonId())
                .note(domain.getNote())
                .createdAt(domain.getCreatedAt())
                .build();
    }
}

