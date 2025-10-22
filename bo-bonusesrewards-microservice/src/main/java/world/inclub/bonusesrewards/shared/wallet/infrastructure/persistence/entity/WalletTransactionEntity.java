package world.inclub.bonusesrewards.shared.wallet.infrastructure.persistence.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static world.inclub.bonusesrewards.shared.wallet.infrastructure.persistence.schema.WalletSchema.SCHEMA;
import static world.inclub.bonusesrewards.shared.wallet.infrastructure.persistence.schema.WalletSchema.Table.WALLET_TRANSACTION_TABLE;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = WALLET_TRANSACTION_TABLE, schema = SCHEMA)
public class WalletTransactionEntity {

    @Id
    @Column("idwallettransaction")
    private Long id;

    @Column("idwallet")
    private Long walletId;

    @Column("idtypewallettransaction")
    private Long walletTransactionTypeId;

    @Column("idcurrency")
    private Long currencyId;

    @Column("idexchangerate")
    private Long exchangeRateId;

    @Column("initialdate")
    private LocalDateTime initiatedAt;

    @Column("amount")
    private BigDecimal amount;

    @Column("isavailable")
    private Boolean isAvailable;

    @Column("availabilitydate")
    private LocalDateTime availableAt;

    @Column("referencedata")
    private String reference;

    @Column("issuccessfultransaction")
    private Boolean isSuccessful;

}
