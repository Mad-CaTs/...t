package world.inclub.membershippayment.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.domain.Persistable;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "paymentvoucher", schema = "bo_membership")
public class PaymentVoucher implements Persistable<Long> {
    @Id
    @Column("idpaymentvoucher")
    private Long idPaymentVoucher;
    @Column("idpayment")
    private Integer idPayment;
    @Column("idsuscription")
    private Integer idSuscription;
    @Column("pathpicture")
    private String pathPicture;
    @Column("operationnumber")
    private String operationNumber;
    @Column("idmethodpaymentsubtype")
    private Integer idMethodPaymentSubType;
    private String note;
    @Column("idpaymentcoincurrency")
    private Integer idPaymentCoinCurrency;
    @Column("subtotalamount")
    private BigDecimal subTotalAmount;
    @Column("commissionpaymentsubtype")
    private BigDecimal commissionPaymentSubType;
    @Column("totalamount")
    private BigDecimal totalAmount;
    @Column("creationdate")
    private LocalDateTime creationDate;
    @Column("companyoperationnumber")
    private String companyOperationNumber;

    @Transient
    private String imagenBase64;
    @Transient
    private boolean StatusSave;

    public PaymentVoucher(PaymentVoucher paymentVoucher) {
    }

    @Override
    public Long getId() {
        return idPaymentVoucher;
    }

    @Override
    public boolean isNew() {
        return idPaymentVoucher == null || idPaymentVoucher == 0;
    }

    public PaymentVoucher(PaymentVoucher voucher, long idPayment, int idSuscription) {
        this.idPayment = (int) idPayment;
        this.idSuscription = idSuscription;
        this.pathPicture = voucher.getPathPicture();
        this.operationNumber = voucher.getOperationNumber();
        this.companyOperationNumber = voucher.getCompanyOperationNumber();
        this.idMethodPaymentSubType = voucher.getIdMethodPaymentSubType();
        this.note = voucher.getNote();
        this.idPaymentCoinCurrency = voucher.getIdPaymentCoinCurrency();
        this.subTotalAmount = voucher.getSubTotalAmount();
        this.commissionPaymentSubType = voucher.getCommissionPaymentSubType();
        this.totalAmount = voucher.getTotalAmount();
        this.creationDate = voucher.getCreationDate();
    }
}

