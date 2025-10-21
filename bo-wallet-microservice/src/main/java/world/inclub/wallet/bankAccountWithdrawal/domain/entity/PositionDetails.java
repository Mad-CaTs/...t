package world.inclub.wallet.bankAccountWithdrawal.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PositionDetails {

    private String typeRecord;        // debe ser "C"
    private String numberOfPayments;      // numérico, longitud 6
    private String processDate;        // AAAAMMDD
    private String payrollSubtype;     // debe ser "O"
    private String chargeAccountType;     // C o M (default C)
    private String chargeAccount;         // alfanumérico, longitud 13
    private String totalPayrollAmount;  // hasta 14 enteros + . + 2 decimales
    private String payrollReference;  // default "Referencia Retiro"
}
