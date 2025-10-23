package world.inclub.bonusesrewards.shared.payment.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRejection {

    private UUID id;
    private UUID paymentId;
    private Long reasonId;
    private String note;
    private LocalDateTime createdAt;
}