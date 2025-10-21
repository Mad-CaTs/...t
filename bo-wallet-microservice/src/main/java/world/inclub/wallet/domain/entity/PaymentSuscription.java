package world.inclub.wallet.domain.entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import world.inclub.wallet.domain.constant.DatabaseConstants;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentSuscription {

    @Column("iduser")
    private Long idUser;

    @Column("idsuscription")
    private Long idSuscription;

    @Column("idpayment")
    private Long idPayment;

    @Column("quoteusd")
    private BigDecimal quote;

    @Column("positiononschedule")
    private Long position;

    @Column("availablebalance")
    private BigDecimal saldoDisponible;

    @Column("accountingbalance")
    private BigDecimal cuentaContable;

    public PaymentSuscription(Long idUser,
                              Long idSuscription,
                              Long idPayment,
                              BigDecimal quote) {
        this.idUser = idUser;
        this.idSuscription = idSuscription;
        this.idPayment = idPayment;
        this.quote = quote;
    }

}
