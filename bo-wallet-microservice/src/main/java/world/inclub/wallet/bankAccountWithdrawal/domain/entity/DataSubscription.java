package world.inclub.wallet.bankAccountWithdrawal.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DataSubscription {

    private String recordType;       // siempre "A"
    private String subscriptionAccountType;    // C, M, A, B
    private String subscriptionAccount;        // depende del tipo
    private String documentType;      // 1, 3, 4, RUC, FIC
    private String documentNumber;    // depende del tipo
    private String workerName;   // máx 75 caracteres
    private String currencyType;         // S o D
    private String subscriptionAmount;         // hasta 14 enteros + 2 decimales
    private String supplierValidation;// siempre "S"

}
