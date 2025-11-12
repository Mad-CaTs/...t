package world.inclub.transfer.liquidation.api.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class PaymentMembershipDto {

    private Long idPayment;
    private Integer idSuscription;
    private String quoteDescription;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime nextExpiration;
    private BigDecimal dollarExchange;
    private BigDecimal quoteUsd;
    private BigDecimal porcentaje;
    private Integer statePaymentId; //verif
    private String obs;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime paydate;
    private BigDecimal pts;
    private Integer isquoteinitial;
    private Integer positionOnSchedule;
    private Integer numberQuotePay;
    private BigDecimal amortizationUsd;
    private BigDecimal capitalbalanceUsd;
    private BigDecimal totalOverdue;
    private Integer percentOverduedetailId;
}