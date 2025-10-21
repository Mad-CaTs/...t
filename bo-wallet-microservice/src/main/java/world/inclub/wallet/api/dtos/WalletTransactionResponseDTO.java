package world.inclub.wallet.api.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class WalletTransactionResponseDTO {

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
    private int idTransactionCategory;
    private String description;

}
