package world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.payment.domain.model.Payment;
import world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.entity.PaymentEntity;

@Component
public class PaymentEntityMapper {

    public Payment toDomain(PaymentEntity entity) {
        if (entity == null) return null;
        return Payment.builder()
                .id(entity.getId())
                .bonusType(entity.getBonusTypeId())
                .sourceTableTypeId(entity.getSourceTableTypeId())
                .sourceRecordId(entity.getSourceRecordId())
                .memberId(entity.getMemberId())
                .paymentType(entity.getPaymentType())
                .paymentSubTypeId(entity.getPaymentSubTypeId())
                .status(entity.getStatus())
                .currencyType(entity.getCurrencyType())
                .subTotalAmount(entity.getSubTotalAmount())
                .commissionAmount(entity.getCommissionAmount())
                .totalAmount(entity.getTotalAmount())
                .paymentDate(entity.getPaymentDate())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public PaymentEntity toEntity(Payment domain) {
        return PaymentEntity.builder()
                .id(domain.getId())
                .bonusTypeId(domain.getBonusType())
                .sourceTableTypeId(domain.getSourceTableTypeId())
                .sourceRecordId(domain.getSourceRecordId())
                .memberId(domain.getMemberId())
                .paymentType(domain.getPaymentType())
                .paymentSubTypeId(domain.getPaymentSubTypeId())
                .status(domain.getStatus())
                .currencyType(domain.getCurrencyType())
                .subTotalAmount(domain.getSubTotalAmount())
                .commissionAmount(domain.getCommissionAmount())
                .totalAmount(domain.getTotalAmount())
                .paymentDate(domain.getPaymentDate())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .build();
    }
}
