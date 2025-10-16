package world.inclub.bonusesrewards.shared.payment.infrastructure.controllers.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RejectPaymentRequest {

    @NotNull(message = "Reason ID is required")
    private Long reasonId;

    @Size(max = 500, message = "Detail must not exceed 500 characters")
    private String detail;
}
