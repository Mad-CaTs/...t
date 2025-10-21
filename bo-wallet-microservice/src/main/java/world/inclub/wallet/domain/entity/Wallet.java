package world.inclub.wallet.domain.entity;

import java.math.BigDecimal;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import world.inclub.wallet.domain.constant.DatabaseConstants;
import world.inclub.wallet.domain.enums.Currency;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = DatabaseConstants.WALLET_TABLE, schema = DatabaseConstants.SCHEMA_NAME)
public class Wallet {

    @Id
    @Column("idwallet")
    private Long idWallet;
    @Column("iduser")
    private Long idUser;
    @Column("idcurrency")
    private Integer idCurrency;
    @Column("availablebalance")
    private BigDecimal availableBalance;
    @Column("accountingbalance")
    private BigDecimal accountingBalance;
    @Column("availablebrandexclusive")
    private BigDecimal availableBrandExclusive;
    @Column("accountingbrandexclusive")
    private BigDecimal accountingBrandExclusive;

    public Wallet(Long idUser) {
        this.idUser = idUser;
        this.idCurrency = Currency.Dolar.getValue();
        this.availableBalance = BigDecimal.ZERO;
        this.accountingBalance = BigDecimal.ZERO;
        this.availableBrandExclusive =BigDecimal.ZERO;
        this.accountingBrandExclusive = BigDecimal.ZERO;
    }


}
