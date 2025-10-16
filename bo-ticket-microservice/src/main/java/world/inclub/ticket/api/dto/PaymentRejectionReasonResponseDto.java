package world.inclub.ticket.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRejectionReasonResponseDto {
    private Long id;
    private String reason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
