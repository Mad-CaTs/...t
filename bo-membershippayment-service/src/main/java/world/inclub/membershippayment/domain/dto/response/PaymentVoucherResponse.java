package world.inclub.membershippayment.domain.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.relational.core.mapping.Column;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentVoucherResponse {

    private Long idPaymentVoucher;
    private Integer idPayment;
    private Integer idSuscription;
    private String pathPicture;
    private String operationNumber;
    private Integer idMethodPaymentSubType;
    private String methodName;
    private String subMethodName;
    private String note;
    private Integer idPaymentCoinCurrency;
    private BigDecimal subTotalAmount;
    private BigDecimal commissionPaymentSubType;
    private BigDecimal totalAmount;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime creationDate;
    private String companyOperationNumber;

}
