package world.inclub.membershippayment.infraestructure.config.kafka.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import world.inclub.membershippayment.domain.enums.Currency;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WalletResponseDto {

    @Id
    @Column("idwallet")
    private Long idWallet;
    @Column("iduser")
    private Long idUser;
    @Column("idcurrency")
    private int idCurrency;
    @Column("availablebalance")
    private BigDecimal availableBalance;
    @Column("accountingbalance")
    private BigDecimal accountingBalance;
    @Column("availablebrandexclusive")
    private BigDecimal availableBrandExclusive;
    @Column("accountingbrandexclusive")
    private BigDecimal accountingBrandExclusive;

    public WalletResponseDto(Long idUser) {
        this.idUser = idUser;
        this.idCurrency = Currency.Dolar.getValue();
        this.availableBalance = BigDecimal.ZERO;
        this.accountingBalance = BigDecimal.ZERO;
        this.availableBrandExclusive =BigDecimal.ZERO;
        this.accountingBrandExclusive = BigDecimal.ZERO;
    }


}
