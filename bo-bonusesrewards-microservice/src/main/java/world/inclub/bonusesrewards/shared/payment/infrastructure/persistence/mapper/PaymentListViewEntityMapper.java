package world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.payment.application.dto.PaymentListView;
import world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.entity.PaymentListViewEntity;

@Component
public class PaymentListViewEntityMapper {

    public PaymentListView toDomain(PaymentListViewEntity entity) {
        if (entity == null) return null;

        return PaymentListView.builder()
                .paymentId(entity.getPaymentId())
                .username(entity.getUsername())
                .memberFullName(entity.getMemberFullName())
                .nrodocument(entity.getNrodocument())
                .operationNumber(entity.getOperationNumber())
                .bonusTypeId(entity.getBonusTypeId())
                .bonusTypeName(entity.getBonusTypeName())
                .installmentNum(entity.getInstallmentNum())
                .currencyTypeId(entity.getCurrencyTypeId())
                .currencyTypeCode(entity.getCurrencyTypeCode())
                .subTotalAmount(entity.getSubTotalAmount())
                .commissionAmount(entity.getCommissionAmount())
                .rateAmount(entity.getRateAmount())
                .totalAmount(entity.getTotalAmount())
                .dueDate(entity.getDueDate())
                .paymentDate(entity.getPaymentDate())
                .voucherImageUrl(entity.getVoucherImageUrl())
                .paymentStatusId(entity.getPaymentStatusId())
                .paymentStatusName(entity.getPaymentStatusName())
                .build();
    }
}
