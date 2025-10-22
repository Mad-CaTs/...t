package world.inclub.membershippayment.infraestructure.config.kafka.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import world.inclub.membershippayment.domain.dto.WalletTransaction;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterPaymenWithWalletResponseDTO {

    private WalletTransaction walletTransaction;

}