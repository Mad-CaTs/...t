package world.inclub.bonusesrewards.shared.payment.infrastructure.controllers.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.codec.multipart.FilePart;

@Data
@NoArgsConstructor
public class CorrectPaymentRequest {

    @NotNull(message = "El archivo del comprobante es obligatorio")
    private FilePart voucherFile;
}
