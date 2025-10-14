package world.inclub.ticket.infraestructure.persistence.mapper.payment;

import org.springframework.stereotype.Component;
import world.inclub.ticket.domain.model.payment.PaymentRejection;
import world.inclub.ticket.infraestructure.persistence.entity.payment.PaymentRejectionEntity;

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
        if (domain == null) return null;
        
        return PaymentRejectionEntity.builder()
                .id(domain.getId())
                .paymentId(domain.getPaymentId())
                .reasonId(domain.getReasonId())
                .note(domain.getNote())
                .createdAt(domain.getCreatedAt())
                .build();
    }

}
