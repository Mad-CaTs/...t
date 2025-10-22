package world.inclub.membershippayment.domain.dto.request;

import lombok.Data;
import org.hibernate.validator.constraints.Range;
import world.inclub.membershippayment.domain.dto.PaypalDTO;
import world.inclub.membershippayment.domain.dto.WalletTransaction;
import world.inclub.membershippayment.domain.entity.PaymentVoucher;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CMeansPayment {

    private Integer idPayment;
    private Integer typeMethodPayment;
    private BigDecimal amountPaidPayment;
    private PaypalDTO paypalDTO;
    
    private List<PaymentVoucher> listaVouches;
    private WalletTransaction walletTransaction;
    private Integer idUserPayment;
    private Integer idPackage;
    private Integer idPackageDetail;
    private List<BigDecimal> listInitialAmounts;

    @Range(min = 1, max = 5, message = "Número de cuotas de fraccionamiento de inicial no válido")
    private Integer numberPaymentInitials;
    private Integer numberAdvancePaymentPaid;
    private Boolean isEditedInitial;

    private Boolean isGracePeriodApplied;
    private Integer typePercentOverdue;
    private BigDecimal totalOverdue;
    private Integer idPercentOverdueDetail;

    private Integer discountPercent;
    private UserDTO user;
}
