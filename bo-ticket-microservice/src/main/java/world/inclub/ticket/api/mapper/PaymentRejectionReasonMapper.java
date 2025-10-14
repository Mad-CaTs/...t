package world.inclub.ticket.api.mapper;

import org.springframework.stereotype.Component;
import world.inclub.ticket.api.dto.PaymentRejectionReasonResponseDto;
import world.inclub.ticket.domain.model.payment.PaymentRejectionReason;

@Component
public class PaymentRejectionReasonMapper {

    public PaymentRejectionReasonResponseDto toResponseDto(PaymentRejectionReason paymentRejectionReason) {
        return PaymentRejectionReasonResponseDto.builder()
                .id(paymentRejectionReason.getId())
                .reason(paymentRejectionReason.getReason())
                .createdAt(paymentRejectionReason.getCreatedAt())
                .updatedAt(paymentRejectionReason.getUpdatedAt())
                .build();
    }

}
