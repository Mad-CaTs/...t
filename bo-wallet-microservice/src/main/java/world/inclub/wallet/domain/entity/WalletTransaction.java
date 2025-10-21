package world.inclub.wallet.domain.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import world.inclub.wallet.domain.constant.DatabaseConstants;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = DatabaseConstants.WALLETTRANSACTION_TABLE, schema = DatabaseConstants.SCHEMA_NAME)
public class WalletTransaction {

    @Id
    @Column("idwallettransaction")
    private Long idWalletTransaction;
    @Column("idwallet")
    private Long idWallet;
    @Column("idtypewallettransaction")
    private int idTypeWalletTransaction;
    @Column("idcurrency")
    private int idCurrency;
    @Column("idexchangerate")
    private int idExchangeRate;
    @Column("initialdate")
    private LocalDateTime initialDate;
    @Column("amount")
    private BigDecimal amount;
    @Column("isavailable")
    private Boolean isAvailable;
    @Column("availabilitydate")
    private LocalDateTime availabilityDate;
    @Column("referencedata")
    private String referenceData;
    @Column("issuccessfultransaction")
    private Boolean isSucessfulTransaction;

    public WalletTransaction(Long idWallet, int idTypeWalletTransaction, int idCurrency, int idExchangeRate,
            BigDecimal amount, Boolean isAvailable, String referenceData) {

        ZoneId zoneId = ZoneId.of("UTC-5");
        ZonedDateTime nowInUtc5 = ZonedDateTime.now(zoneId);


        this.idWallet = idWallet;
        this.idTypeWalletTransaction = idTypeWalletTransaction;
        this.idCurrency = idCurrency;
        this.idExchangeRate = idExchangeRate;
        this.amount = amount;
        this.isAvailable = isAvailable;
        this.referenceData = referenceData;
        this.initialDate = nowInUtc5.toLocalDateTime();
        this.availabilityDate = nowInUtc5.toLocalDateTime();
        this.isSucessfulTransaction = isAvailable;
    }

    public WalletTransaction(Long idWallet, int idTypeWalletTransaction, int idCurrency, int idExchangeRate,
            BigDecimal amount, Boolean isAvailable, LocalDateTime availabilityDate, String referenceData) {

        ZoneId zoneId = ZoneId.of("UTC-5");
        ZonedDateTime nowInUtc5 = ZonedDateTime.now(zoneId);

        this.idWallet = idWallet;
        this.idTypeWalletTransaction = idTypeWalletTransaction;
        this.idCurrency = idCurrency;
        this.idExchangeRate = idExchangeRate;
        this.amount = amount;
        this.isAvailable = isAvailable;
        this.initialDate = nowInUtc5.toLocalDateTime();
        this.availabilityDate = nowInUtc5.toLocalDateTime();
        this.referenceData = referenceData;
        this.isSucessfulTransaction = isAvailable;
    }

    public WalletTransaction(int idTypeWalletTransaction, LocalDateTime initialDate, BigDecimal amount,
            String referenceData) {

        ZoneId zoneId = ZoneId.of("UTC-5");
        ZonedDateTime nowInUtc5 = ZonedDateTime.now(zoneId);

        this.idTypeWalletTransaction = idTypeWalletTransaction;
        this.initialDate = nowInUtc5.toLocalDateTime();
        this.availabilityDate = nowInUtc5.toLocalDateTime();
        this.amount = amount;
        this.referenceData = referenceData;
        this.isSucessfulTransaction = isAvailable;

    }

    public WalletTransaction(int idTypeWalletTransaction, LocalDateTime initialDate, BigDecimal amount) {
        
        ZoneId zoneId = ZoneId.of("UTC-5");
        ZonedDateTime nowInUtc5 = ZonedDateTime.now(zoneId);

        this.idTypeWalletTransaction = idTypeWalletTransaction;
        this.initialDate = nowInUtc5.toLocalDateTime();
        this.availabilityDate = nowInUtc5.toLocalDateTime();
        this.amount = amount;
        this.isSucessfulTransaction = isAvailable;

    }

}
