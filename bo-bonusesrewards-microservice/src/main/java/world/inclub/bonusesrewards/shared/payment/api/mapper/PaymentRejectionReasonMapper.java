package world.inclub.bonusesrewards.shared.payment.api.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.payment.api.dto.PaymentRejectionReasonResponseDto;
import world.inclub.bonusesrewards.shared.payment.domain.model.PaymentRejectionReason;

import java.time.LocalDateTime;

@Component
public class PaymentRejectionReasonMapper {

    public PaymentRejectionReasonResponseDto toResponseDto(PaymentRejectionReason paymentRejectionReason) {
        return PaymentRejectionReasonResponseDto.builder()
                .id(paymentRejectionReason.getReasonId())
                .reason(paymentRejectionReason.getReason())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }
}
