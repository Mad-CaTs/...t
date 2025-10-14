package world.inclub.ticket.infraestructure.kafka.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRejectionDto {
    private Long paymentId;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime rejectedAt;
    
    private String reason;
    private String detail;
    private String status; // "TEMPORAL_REJECTED" o "REJECTED"
}
