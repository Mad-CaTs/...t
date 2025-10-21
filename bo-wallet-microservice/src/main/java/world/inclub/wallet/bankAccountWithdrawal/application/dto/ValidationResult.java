package world.inclub.wallet.bankAccountWithdrawal.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import world.inclub.wallet.bankAccountWithdrawal.domain.entity.PositionDetails;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ValidationResult {
    private boolean valid;
    private List<String> warnings;
    private List<String> errors;
    private Integer totalRecords;
    private Integer validRecords;
    private String message;
    private SubscriptionValidationSummary data;
    private PositionDetails positionDetails;


    public boolean isValid() { return valid; }
    public List<String> getErrors() { return errors; }
}
