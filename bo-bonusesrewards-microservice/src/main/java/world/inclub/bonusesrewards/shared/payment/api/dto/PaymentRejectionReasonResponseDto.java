package world.inclub.bonusesrewards.shared.payment.api.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PaymentRejectionReasonResponseDto {
    private Long id;
    private String reason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
