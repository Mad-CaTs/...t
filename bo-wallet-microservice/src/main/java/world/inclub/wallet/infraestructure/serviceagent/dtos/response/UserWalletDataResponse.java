package world.inclub.wallet.infraestructure.serviceagent.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import world.inclub.wallet.domain.entity.Wallet;
import world.inclub.wallet.infraestructure.serviceagent.dtos.UserAccountResponse;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserWalletDataResponse {

    private UserAccountResponse userAccount;
    private Wallet wallet;
    private List<WalletTransactionResponse> transactions;
}
