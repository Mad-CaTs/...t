package world.inclub.bonusesrewards.shared.wallet.infrastructure.persistence.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;

import static world.inclub.bonusesrewards.shared.wallet.infrastructure.persistence.schema.WalletSchema.Table.WALLET_TABLE;
import static world.inclub.bonusesrewards.shared.wallet.infrastructure.persistence.schema.WalletSchema.SCHEMA;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = WALLET_TABLE, schema = SCHEMA)
public class WalletEntity {

    @Id
    @Column("idwallet")
    private Long id;

    @Column("iduser")
    private Long memberId;

    @Column("idcurrency")
    private Long currencyId;

    @Column("availablebalance")
    private BigDecimal availableBalance;

    @Column("accountingbalance")
    private BigDecimal accountingBalance;

    @Column("availablebrandexclusive")
    private BigDecimal availableBrandExclusive;

    @Column("accountingbrandexclusive")
    private BigDecimal accountingBrandExclusive;

}
