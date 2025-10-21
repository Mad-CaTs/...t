package world.inclub.wallet.bankAccountWithdrawal.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CombinedValidationResult {
    private ValidationResult generalInformationResult;
    private ValidationResult dateSubscriptionResult;
    private ValidationResult positionDetailsResult;
    private boolean allValid;
    private byte[] excelBytes;

    public int countInvalid() {
        int count = 0;
        if (!generalInformationResult.isValid()) count++;
        if (!positionDetailsResult.isValid()) count++;
        if (!dateSubscriptionResult.isValid()) count++;
        return count;
    }
}
