package world.inclub.membershippayment.domain.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.domain.Persistable;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "payment", schema = "bo_membership")
public class Payment  {

    @Id
    @Column("idpayment")
    private Long idPayment;
    @Column("idsuscription")
    private Integer idSuscription;
    @Column("quotedescription")
    private String quoteDescription;
    @Column("nextexpirationdate")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime nextExpirationDate;
    @Column("dollarexchange")
    private BigDecimal dollarExchange;
    @Column("quoteusd")
    private BigDecimal quoteUsd;
    private BigDecimal percentage;
    @Column("idstatepayment")
    private Integer idStatePayment; //verif
    private String obs;
    @Column("paydate")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime payDate;
    private BigDecimal pts;
    @Column("isinitialquote")
    private Integer isInitialQuote;
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
    @Column("idpercentoverduedetail")
    private Integer idPercentOverduedetail;

}

//Para idStatePayment; vamos a agregar el estado 666
//Cuando se esta en el proceso de migracion
//Primero respaldamos data para el Historico y Operamos con Fe
