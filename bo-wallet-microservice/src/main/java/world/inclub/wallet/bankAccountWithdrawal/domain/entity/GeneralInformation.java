package world.inclub.wallet.bankAccountWithdrawal.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GeneralInformation {
    private String customerCode; // longitud 6, alfanumérico, default 000000
    private String typeSpreadsheet; // debe ser "HABER"
}
