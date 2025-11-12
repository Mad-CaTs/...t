package world.inclub.transfer.liquidation.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import world.inclub.transfer.liquidation.domain.constant.DatabaseConstants;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = DatabaseConstants.PAYMENT_LOG, schema = DatabaseConstants.SCHEMA_NAME)
public class PaymentLog {

    @Id
    @Column("id_payment_log")
    private Integer idPaymentLog;

    @Column("idsuscription")
    private Integer idSuscription;

    @Column("idpayment")
    private Integer idPayment;

    @Column("quotedescription")
    private String quoteDescription;

    @Column("nextexpiration")
    private LocalDateTime nextExpiration;

    @Column("dollarexchange")
    private BigDecimal dollarExchange;

    @Column("quotausd")
    private BigDecimal quotaUsd;

    @Column("percentage")
    private BigDecimal percentage;

    @Column("statepaymentid")
    private Integer statePaymentId;

    @Column("obs")
    private String obs;

    @Column("paydate")
    private LocalDateTime payDate;

    @Column("pts")
    private BigDecimal pts;

    @Column("isquoteinitial")
    private Integer isQuoteInitial;

    @Column("positiononschedule")
    private Integer positionOnSchedule;

    @Column("numberquotepay")
    private Integer numberQuotePay;

    @Column("amortizationusd")
    private BigDecimal amortizationUsd;

    @Column("capitalbalanceusd")
    private BigDecimal capitalBalanceUsd;

    @Column("totaloverdue")
    private BigDecimal totalOverdue;

    @Column("percentoverduedetailid")
    private Integer percentOverdueDetailId;
}
