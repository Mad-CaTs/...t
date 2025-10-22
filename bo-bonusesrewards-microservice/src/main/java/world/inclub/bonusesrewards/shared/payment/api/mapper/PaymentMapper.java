package world.inclub.bonusesrewards.shared.payment.api.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.payment.domain.model.Payment;
import world.inclub.bonusesrewards.shared.payment.api.dto.PaymentResponseDto;

@Component
public class PaymentMapper {

    public PaymentResponseDto toResponseDto(Payment payment) {
        if (payment == null) return null;

        return PaymentResponseDto.builder()
                .id(payment.getId())
                .memberId(payment.getMemberId())
                .bonusType(payment.getBonusType())
                .paymentType(payment.getPaymentType())
                .status(payment.getStatus())
                .currencyType(payment.getCurrencyType())
                .subTotalAmount(payment.getSubTotalAmount())
                .commissionAmount(payment.getCommissionAmount())
                .totalAmount(payment.getTotalAmount())
                .paymentDate(payment.getPaymentDate())
                .createdAt(payment.getCreatedAt())
//                .rejection(null)
                .build();
    }
}
