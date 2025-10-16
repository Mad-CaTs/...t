package world.inclub.bonusesrewards.shared.payment.application.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.payment.domain.model.Payment;
import world.inclub.bonusesrewards.shared.payment.infrastructure.controllers.dto.response.PaymentResponseDto;

@Component
public class PaymentMapper {

    public PaymentResponseDto toResponseDto(Payment payment) {
        if (payment == null) return null;

        return PaymentResponseDto.builder()
                .id(payment.getId())
                .memberId(payment.getMemberId())
                .bonusTypeId(payment.getBonusTypeId())
                .paymentTypeId(payment.getPaymentTypeId())
                .statusId(payment.getStatusId())
                .currencyTypeId(payment.getCurrencyTypeId())
                .subTotalAmount(payment.getSubTotalAmount())
                .commissionAmount(payment.getCommissionAmount())
                .totalAmount(payment.getTotalAmount())
                .paymentDate(payment.getPaymentDate())
                .createdAt(payment.getCreatedAt())
                .rejection(null)
                .build();
    }
}
