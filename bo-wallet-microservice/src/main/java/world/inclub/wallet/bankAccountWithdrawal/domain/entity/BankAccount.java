package world.inclub.wallet.bankAccountWithdrawal.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BankAccount {
    private String fullName;
    private String numDocument;
    private String numberAccount;
    private String estado;
}