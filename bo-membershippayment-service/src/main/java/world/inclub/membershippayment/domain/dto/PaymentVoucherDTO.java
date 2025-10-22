package world.inclub.membershippayment.domain.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Setter
@Getter

@NoArgsConstructor
@Builder
public class PaymentVoucherDTO {
    private int idPaymentVoucher;

    private int paymentId;

    private int suscriptionId;

    private String pathPicture;

    private String operationNumber;

    private int methodPaymentSubTypeId;

    private String note;

    private int paymentCoinCurrencyId;

    private BigDecimal subTotalAmount;

    private BigDecimal comissionPaymentSubType;

    private BigDecimal totalAmount;

    private LocalDateTime creationDate;

    private String companyOperationNumber;

    // constructor
    public PaymentVoucherDTO(int idPaymentVoucher, int paymentId, int suscriptionId, String namePicture, String operationNumber, int methodPaymentSubTypeId, String note, int paymentCoinCurrencyId, BigDecimal subTotalAmount, BigDecimal comissionPaymentSubType, BigDecimal totalAmount, LocalDateTime creationDate, String companyOperationNumber) {
    }
}
