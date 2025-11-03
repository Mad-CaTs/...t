package world.inclub.wallet.infraestructure.serviceagent.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import world.inclub.wallet.domain.entity.WalletTransaction;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WalletTransactionResponse {

    private Long idWalletTransaction;
    private Long idWallet;
    private int idTypeWalletTransaction;
    private String typeDescription;
    private int idCurrency;
    private int idExchangeRate;
    private LocalDateTime initialDate;
    private BigDecimal amount;
    private Boolean isAvailable;
    private LocalDateTime availabilityDate;
    private String referenceData;
    private Boolean isSucessfulTransaction;

    public WalletTransactionResponse(WalletTransaction tx, String typeDescription) {
        this.idWalletTransaction = tx.getIdWalletTransaction();
        this.idWallet = tx.getIdWallet();
        this.idTypeWalletTransaction = tx.getIdTypeWalletTransaction();
        this.typeDescription = typeDescription;
        this.idCurrency = tx.getIdCurrency();
        this.idExchangeRate = tx.getIdExchangeRate();
        this.initialDate = tx.getInitialDate();
        this.amount = tx.getAmount();
        this.isAvailable = tx.getIsAvailable();
        this.availabilityDate = tx.getAvailabilityDate();
        this.referenceData = tx.getReferenceData();
        this.isSucessfulTransaction = tx.getIsSucessfulTransaction();
    }
}
