package world.inclub.wallet.api.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WalletTransactionRechargeDTO {
    private Long idWalletTransaction;
    private Long idWallet;
    private BigDecimal amount;
    private Boolean isAvailable;
    private String referenceData;
    private Boolean isSucessfulTransaction;
    private String transactionPaypal;
}
