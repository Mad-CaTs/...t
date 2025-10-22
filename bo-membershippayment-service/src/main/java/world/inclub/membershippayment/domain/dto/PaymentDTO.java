package world.inclub.membershippayment.domain.dto;


import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Column;

import lombok.Builder;
import lombok.Data;
import world.inclub.membershippayment.domain.entity.PaymentVoucher;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;


@Data
@Builder
public class PaymentDTO {
    @Id
    @Column("idpayment")
    private int idPayment;

    @Column("idsuscription")
    private int idSuscription;

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
    private int statePaymentId;

    @Column("obs")
    private String obs;

    @Column("paydate")
    private LocalDateTime payDate;

    @Column("pts")
    private BigDecimal pts;

    @Column("isquoteinitial")
    private int isQuoteInitial;

    @Column("positiononschedule")
    private int positionOnSchedule;

    @Column("numberquotepay")
    private int numberQuotePay;

    @Column("amortizationusd")
    private BigDecimal amortizationUsd;

    @Column("capitalbalanceusd")
    private BigDecimal capitalBalanceUsd;

    @Column("totaloverdue")
    private BigDecimal totalOverdue;

    @Column("percentoverduedetailid")
    private int percentOverdueDetailId;

    @Transient
    private List<PaymentVoucher> paymentVoucherList;


    public PaymentDTO(Long idPayment, Integer idSuscription, String quoteDescription, LocalDateTime nextExpiration, BigDecimal dollarExchange, BigDecimal quoteUsd, BigDecimal porcentaje, Integer statePaymentId, String obs, LocalDateTime paydate, BigDecimal pts, Integer isquoteinitial, Integer positionOnSchedule, Integer numberQuotePay, BigDecimal amortizationUsd, BigDecimal capitalbalanceUsd, BigDecimal totalOverdue, Integer percentOverduedetailId) {
    }



    public PaymentDTO(int idPayment, int idSuscription, String quoteDescription, LocalDateTime nextExpiration,
                   BigDecimal dollarExchange, BigDecimal quotaUsd, BigDecimal percentage, int statePaymentId, String obs,
                   LocalDateTime payDate, BigDecimal pts, int isQuoteInitial, int positionOnSchedule, int numberQuotePay,
                   BigDecimal amortizationUsd, BigDecimal capitalBalanceUsd, BigDecimal totalOverdue,
                   int percentOverdueDetailId, List<PaymentVoucher> paymentVoucherList) {
        this.idPayment = idPayment;
        this.idSuscription = idSuscription;
        this.quoteDescription = quoteDescription;
        this.nextExpiration = nextExpiration;
        this.dollarExchange = dollarExchange;
        this.quotaUsd = quotaUsd;
        this.percentage = percentage;
        this.statePaymentId = statePaymentId;
        this.obs = obs;
        this.payDate = payDate;
        this.pts = pts;
        this.isQuoteInitial = isQuoteInitial;
        this.positionOnSchedule = positionOnSchedule;
        this.numberQuotePay = numberQuotePay;
        this.amortizationUsd = amortizationUsd;
        this.capitalBalanceUsd = capitalBalanceUsd;
        this.totalOverdue = totalOverdue;
        this.percentOverdueDetailId = percentOverdueDetailId;
        this.paymentVoucherList = paymentVoucherList;
    }

    public PaymentDTO() {

    }
}