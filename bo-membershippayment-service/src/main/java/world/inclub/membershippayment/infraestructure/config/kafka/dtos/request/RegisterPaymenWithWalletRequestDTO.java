package world.inclub.membershippayment.infraestructure.config.kafka.dtos.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import world.inclub.membershippayment.domain.dto.WalletTransaction;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterPaymenWithWalletRequestDTO {

    private Long idUserPayment;
    private WalletTransaction walletTransaction;
    private int typeWalletTransaction;
    private Boolean isFullPayment;
    private String detailPayment;

}