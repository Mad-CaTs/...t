package world.inclub.wallet.bankAccountWithdrawal.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SubscriptionValidationSummary {
    private int totalRegistros;
    private int cantidadCorrectos;
    private int cantidadIncorrectos;
    private List<SubscriptionValidationDto> correctos;
    private List<SubscriptionValidationError> incorrectos;
}
