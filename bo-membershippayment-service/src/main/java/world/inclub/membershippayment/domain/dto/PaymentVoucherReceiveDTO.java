package world.inclub.membershippayment.domain.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PaymentVoucherReceiveDTO {
    private Integer idPaymentVoucher;
    private Integer paymentId;
    private Integer suscriptionId;
    private String pathPicture;
    private String operationNumber;
    private Integer methodPaymentSubTypeId;
    private String note;
    private Integer paymentCoinCurrencyId;
    private BigDecimal subTotalAmount;
    private BigDecimal comissionPaymentSubType;
    private BigDecimal totalAmount;
    private LocalDateTime creationDate;
    private String companyOperationNumber;
}