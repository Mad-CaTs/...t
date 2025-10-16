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
public class PaymentRejection {

    private Long id;
    private Long paymentId;
    private Long reasonId;
    private String note;
    private LocalDateTime createdAt;
    
}
