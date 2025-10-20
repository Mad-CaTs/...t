package world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.bonus.domain.model.BonusType;
import world.inclub.bonusesrewards.shared.payment.domain.model.CurrencyType;
import world.inclub.bonusesrewards.shared.payment.domain.model.Payment;
import world.inclub.bonusesrewards.shared.payment.domain.model.PaymentStatus;
import world.inclub.bonusesrewards.shared.payment.domain.model.PaymentType;
import world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.entity.PaymentEntity;

@Component
public class PaymentEntityMapper {

    public Payment toDomain(PaymentEntity entity) {
        if (entity == null) return null;

        return Payment.builder()
                .id(entity.getId())
                .bonusType(BonusType.fromId(entity.getBonusTypeId()))
                .sourceTableTypeId(entity.getSourceTableTypeId())
                .sourceRecordId(entity.getSourceRecordId())
                .memberId(entity.getMemberId())
                .paymentType(PaymentType.fromId(entity.getPaymentTypeId()))
                .paymentSubTypeId(entity.getPaymentSubTypeId())
                .status(PaymentStatus.fromId(entity.getStatusId()))
                .currencyType(CurrencyType.fromId(entity.getCurrencyTypeId()))
                .subTotalAmount(entity.getSubTotalAmount())
                .commissionAmount(entity.getCommissionAmount())
                .totalAmount(entity.getTotalAmount())
                .paymentDate(entity.getPaymentDate())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public PaymentEntity toEntity(Payment domain) {
        if (domain == null) return null;

        return PaymentEntity.builder()
                .id(domain.getId())
                .bonusTypeId(domain.getBonusType().getId())
                .sourceTableTypeId(domain.getSourceTableTypeId())
                .sourceRecordId(domain.getSourceRecordId())
                .memberId(domain.getMemberId())
                .paymentTypeId(domain.getPaymentType().getId())
                .paymentSubTypeId(domain.getPaymentSubTypeId())
                .statusId(domain.getStatus().getId())
                .currencyTypeId(domain.getCurrencyType().getId())
                .subTotalAmount(domain.getSubTotalAmount())
                .commissionAmount(domain.getCommissionAmount())
                .totalAmount(domain.getTotalAmount())
                .paymentDate(domain.getPaymentDate())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .build();
    }
}
