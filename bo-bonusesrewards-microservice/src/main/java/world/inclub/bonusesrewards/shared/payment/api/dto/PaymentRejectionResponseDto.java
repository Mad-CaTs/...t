package world.inclub.bonusesrewards.shared.payment.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRejectionResponseDto {
    private Long id;
    private UUID paymentId;
    private Long reasonId;
    private String note;
    private Instant createdAt;
}