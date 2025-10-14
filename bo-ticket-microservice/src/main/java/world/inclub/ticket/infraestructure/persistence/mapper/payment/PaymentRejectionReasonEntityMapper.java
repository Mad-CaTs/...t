package world.inclub.ticket.infraestructure.persistence.mapper.payment;

import org.springframework.stereotype.Component;
import world.inclub.ticket.domain.model.payment.PaymentRejectionReason;
import world.inclub.ticket.infraestructure.persistence.entity.payment.PaymentRejectionReasonEntity;

@Component
public class PaymentRejectionReasonEntityMapper {

    public PaymentRejectionReason toDomain(PaymentRejectionReasonEntity entity) {
        if (entity == null) return null;
        
        return PaymentRejectionReason.builder()
                .id(entity.getId())
                .reason(entity.getReason())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public PaymentRejectionReasonEntity toEntity(PaymentRejectionReason domain) {
        if (domain == null) return null;
        
        return PaymentRejectionReasonEntity.builder()
                .id(domain.getId())
                .reason(domain.getReason())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .build();
    }

}
