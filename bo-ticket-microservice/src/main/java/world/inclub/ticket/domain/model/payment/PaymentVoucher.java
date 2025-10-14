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
public class PaymentVoucher {

    private Long id;
    private Long paymentId;
    private String operationNumber;
    private String note;
    private String imageUrl;
    private LocalDateTime createdAt;
    
}
