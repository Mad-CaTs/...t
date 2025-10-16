package world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.payment.domain.model.PaymentVoucher;
import world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.entity.PaymentVoucherEntity;

@Component
public class PaymentVoucherEntityMapper {

    public PaymentVoucher toDomain(PaymentVoucherEntity entity) {
        if (entity == null) return null;
        return PaymentVoucher.builder()
                .id(entity.getId())
                .paymentId(entity.getPaymentId())
                .operationNumber(entity.getOperationNumber())
                .note(entity.getNote())
                .imageUrl(entity.getImageUrl())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    public PaymentVoucherEntity toEntity(PaymentVoucher domain) {
        return PaymentVoucherEntity.builder()
                .id(domain.getId())
                .paymentId(domain.getPaymentId())
                .operationNumber(domain.getOperationNumber())
                .note(domain.getNote())
                .imageUrl(domain.getImageUrl())
                .createdAt(domain.getCreatedAt())
                .build();
    }
}

