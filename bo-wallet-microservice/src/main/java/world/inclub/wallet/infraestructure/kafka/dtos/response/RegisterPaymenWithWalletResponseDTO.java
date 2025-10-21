package world.inclub.wallet.infraestructure.kafka.dtos.response;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import world.inclub.wallet.domain.entity.WalletTransaction;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterPaymenWithWalletResponseDTO {

    private WalletTransaction walletTransaction;

}
