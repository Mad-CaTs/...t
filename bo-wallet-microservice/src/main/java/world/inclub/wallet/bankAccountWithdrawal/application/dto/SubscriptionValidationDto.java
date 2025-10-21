package world.inclub.wallet.bankAccountWithdrawal.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SubscriptionValidationDto {
    private String recordType;
    private String subscriptionAccountType;
    private String subscriptionAccount;
    private String documentType;
    private String documentNumber;
    private String workerName;
    private String currencyType;
    private String subscriptionAmount;
    private String supplierValidation;
}
