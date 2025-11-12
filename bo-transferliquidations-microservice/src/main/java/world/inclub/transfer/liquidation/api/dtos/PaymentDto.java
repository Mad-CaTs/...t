package world.inclub.transfer.liquidation.api.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDto {

    private int idPayment;
    private int idSuscription;
    private String quoteDescription;
    private LocalDateTime nextExpiration;
    private BigDecimal dollarExchange;
    private BigDecimal quotaUsd;
    private BigDecimal percentage;
    private int statePaymentId;
    private String obs;
    private LocalDateTime payDate;
    private BigDecimal pts;
    private int isQuoteInitial;
    private int positionOnSchedule;
    private int numberQuotePay;
    private BigDecimal amortizationUsd;
    private BigDecimal capitalBalanceUsd;
    private BigDecimal totalOverdue;
    private int percentOverdueDetailId;
    //private List<PaymentVoucher> paymentVouchers;
   
}   
