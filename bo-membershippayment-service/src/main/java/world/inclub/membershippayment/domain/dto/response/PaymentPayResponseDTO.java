package world.inclub.membershippayment.domain.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.springframework.data.relational.core.mapping.Column;
import world.inclub.membershippayment.domain.entity.Payment;
import world.inclub.membershippayment.domain.entity.PaymentVoucher;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PaymentPayResponseDTO  {

    private Long idPayment;
    private Integer idSuscription;
    private String quoteDescription;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime nextExpirationDate;
    private BigDecimal dollarExchange;
    private BigDecimal quoteUsd;
    private BigDecimal percentage;
    private Integer idStatePayment;
    private String obs;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime payDate;
    private BigDecimal pts;
    private Integer isInitialQuote;
    private Integer positionOnSchedule;
    private Integer numberQuotePay;
    private BigDecimal amortizationUsd;
    private BigDecimal capitalBalanceUsd;
    private BigDecimal totalOverdue;
    private Integer idPercentOverduedetail;

    private BigDecimal total;
    private boolean payed;
    private String statusName;
    private String nameSuscription;
    private Integer idPackage;
    private Integer daysOverdue;
    private List<PaymentVoucherResponse> vouchers;

}
