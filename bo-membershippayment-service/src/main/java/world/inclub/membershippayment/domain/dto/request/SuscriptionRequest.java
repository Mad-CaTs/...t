package world.inclub.membershippayment.domain.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import world.inclub.membershippayment.domain.dto.WalletTransaction;
import world.inclub.membershippayment.domain.entity.PaymentVoucher;
import world.inclub.membershippayment.domain.entity.User;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SuscriptionRequest {
    private User user;
    private Integer idSponsor;
    private Integer typeCurrency;
    private Integer gracePeriodParameterId;
    private Integer numberPaymentInitials;
    private Boolean isEditedInitial;
    private List<BigDecimal> listInitialAmounts;
    private WalletTransaction walletTransaction;
    private Integer typeMethodPayment;// revisar
    private Boolean isPayLater;
    private String email;
    private String promotionalCodeVersion;
    private BigDecimal amountPaid;
    private String operationNumber;
    private Integer totalNumberPaymentPaid;
    private Integer typeUser;
    //  AÑADIMOS EL discountPercent de mi Validador
    private Integer discountPercent;

    // Esta variable es para que el socio pueda trasferir su suscripción a su nuevo multi-código
    private Long idSubscription;

    private Integer paymentSubTypeId;
    private Integer packageId;
    private List<PaymentVoucher>  listaVouches;
}
