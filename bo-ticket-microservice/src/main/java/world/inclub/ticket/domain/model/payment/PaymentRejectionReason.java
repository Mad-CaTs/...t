package world.inclub.ticket.domain.model.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRejectionReason {

    private Long id;
    private String reason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
