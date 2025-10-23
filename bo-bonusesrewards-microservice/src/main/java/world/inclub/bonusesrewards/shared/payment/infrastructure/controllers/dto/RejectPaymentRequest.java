package world.inclub.bonusesrewards.shared.payment.infrastructure.controllers.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RejectPaymentRequest {

    @NotNull(message = "Rejection reason ID is required")
    private Long reasonId;

    @Size(max = 250, message = "Detail of the reason cannot exceed 250 characters")
    private String detail;
}
