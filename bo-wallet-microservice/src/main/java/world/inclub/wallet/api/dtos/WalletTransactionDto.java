package world.inclub.wallet.api.dtos;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class WalletTransactionDto {

    private Long idWalletTransaction;

    private Long idWallet;

    private int idTypeWalletTransaction;

    private int idCurrency;

    private int idExchangeRate;

    private LocalDateTime initialDate;

    private BigDecimal amount;

    private Boolean isAvailable;

    private LocalDateTime availabilityDate;

    private String referenceData;

    private Boolean isSucessfulTransaction;

}
