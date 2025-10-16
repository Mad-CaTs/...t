package world.inclub.bonusesrewards.shared.payment.domain.model;

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
public class PaymentVoucher {

    private Long id;
    private UUID paymentId;
    private String operationNumber;
    private String note;
    private String imageUrl;
    private Instant createdAt;
}
