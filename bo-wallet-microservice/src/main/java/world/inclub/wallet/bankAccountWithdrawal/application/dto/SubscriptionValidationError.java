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
public class SubscriptionValidationError {
    private SubscriptionValidationDto registro;
    private List<String> errores;
}
