package world.inclub.membershippayment.domain.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentRequest {
    private Long idPayment;
    private Integer idSuscription;
    private String quoteDescription;
    private LocalDate nextExpiration;
    private BigDecimal dollarExchange;
    private BigDecimal quoteUsd;
    private BigDecimal porcentaje;
    private Integer statePaymentId; //verif
    private String obs;
    private LocalDate paydate;
    private BigDecimal pts;
    private Integer isquoteinitial;
    private Integer positionOnSchedule;
    private Integer numberQuotePay;
    private BigDecimal amortizationUsd;
    private BigDecimal capitalbalanceUsd;
    private BigDecimal totalOverdue;
    private Integer percentOverduedetailId;

}