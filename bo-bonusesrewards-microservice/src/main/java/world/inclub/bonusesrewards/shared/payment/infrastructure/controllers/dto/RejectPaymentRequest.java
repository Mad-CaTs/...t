package world.inclub.bonusesrewards.shared.payment.infrastructure.controllers.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RejectPaymentRequest {

    @NotNull(message = "El ID del motivo del rechazo es obligatorio")
    private Long reasonId;

    @Size(max = 250, message = "El detalle del motivo no puede exceder 250 caracteres")
    private String detail;
}
