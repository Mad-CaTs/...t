package world.inclub.membershippayment.domain.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SubscriptionDelayRequest {
    private Long idPayment;
    private Long idSubscription;
    private LocalDateTime expirationDate;
    private LocalDateTime paymentDate;
}
