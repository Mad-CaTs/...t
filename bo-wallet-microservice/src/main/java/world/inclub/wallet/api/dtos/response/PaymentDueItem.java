package world.inclub.wallet.api.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDueItem {

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

    private Long idAffiliatePay;
    private Long idWallet;
    private Long idPackage;
    private String namePackage;
    private Long numberQuotas;
    private BigDecimal amount;
    private Long idPackageDetail;
    private LocalDateTime dateAffiliate;
    private LocalDateTime dateDesAffiliate;
    private Long idReason;
    private boolean status;


}
