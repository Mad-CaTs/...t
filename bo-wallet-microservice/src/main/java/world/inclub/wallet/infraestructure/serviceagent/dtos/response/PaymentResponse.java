package world.inclub.wallet.infraestructure.serviceagent.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private int idPayment;
    private Long idSuscription;
    private String quoteDescription;
    private LocalDateTime nextExpirationDate;
    private double dollarExchange;
    private double quoteUsd;
    private double percentage;
    private int idStatePayment;
    private String obs;
    private LocalDateTime payDate;
    private double pts;
    private int isInitialQuote;
    private int positionOnSchedule;
    private int numberQuotePay;
    private double amortizationUsd;
    private double capitalBalanceUsd;
    private int totalOverdue;
    private Integer idPercentOverduedetail;
}
