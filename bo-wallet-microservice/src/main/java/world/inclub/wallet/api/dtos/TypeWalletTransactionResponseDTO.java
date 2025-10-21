package world.inclub.wallet.api.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TypeWalletTransactionResponseDTO {
    private Integer idTypeWalletTransaction;
    private String description;
}
