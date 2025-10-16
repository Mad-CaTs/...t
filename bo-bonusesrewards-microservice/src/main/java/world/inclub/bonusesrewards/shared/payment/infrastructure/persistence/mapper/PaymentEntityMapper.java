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
                .bonusTypeId(entity.getBonusTypeId())
                .sourceTableTypeId(entity.getSourceTableTypeId())
                .sourceRecordId(entity.getSourceRecordId())
                .memberId(entity.getMemberId())
                .paymentTypeId(entity.getPaymentTypeId())
                .paymentSubTypeId(entity.getPaymentSubTypeId())
                .statusId(entity.getStatusId())
                .currencyTypeId(entity.getCurrencyTypeId())
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
                .bonusTypeId(domain.getBonusTypeId())
                .sourceTableTypeId(domain.getSourceTableTypeId())
                .sourceRecordId(domain.getSourceRecordId())
                .memberId(domain.getMemberId())
                .paymentTypeId(domain.getPaymentTypeId())
                .paymentSubTypeId(domain.getPaymentSubTypeId())
                .statusId(domain.getStatusId())
                .currencyTypeId(domain.getCurrencyTypeId())
                .subTotalAmount(domain.getSubTotalAmount())
                .commissionAmount(domain.getCommissionAmount())
                .totalAmount(domain.getTotalAmount())
                .paymentDate(domain.getPaymentDate())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .build();
    }
}
