package world.inclub.membershippayment.domain.dto;

import lombok.Data;

import java.math.BigDecimal;
@Data
public class WalletTransaction {
    private Long idWallet;
    private BigDecimal amount;
    private int idTypeWalletTransaction;
    private Long idWalletTransaction;
    private int idExchangeRate;
    private String referenceData;
    private Boolean isSucessfulTransaction;
}
