package world.inclub.bonusesrewards.shared.payment.infrastructure.controllers.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.codec.multipart.FilePart;

@Data
@NoArgsConstructor
public class CorrectPaymentRequest {

    @NotNull(message = "Voucher is mandatory")
    private FilePart voucherFile;

    @NotBlank(message = "Operation Number is mandatory")
    private String operationNumber;

    @NotBlank(message = "Note is mandatory")
    private String note;
}
