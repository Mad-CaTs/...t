package world.inclub.wallet.bankAccountWithdrawal.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BankAccountDTO {
    // private String id;
    private String fullName;
    private String numDocument;
    private String numberAccount;
    private String estado;
    private String observacion;
}