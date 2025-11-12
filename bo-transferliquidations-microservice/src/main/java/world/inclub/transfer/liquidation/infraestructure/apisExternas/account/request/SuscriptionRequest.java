package world.inclub.transfer.liquidation.infraestructure.apisExternas.account.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import world.inclub.transfer.liquidation.infraestructure.apisExternas.account.entity.User;

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
    private Integer typeMethodPayment;// revisar
    private Boolean isPayLater;
    private String email;
    private String promotionalCodeVersion;
    private BigDecimal amountPaid;
    private String operationNumber;
    private Integer totalNumberPaymentPaid;
    private Integer typeUser;
    private Integer paymentSubTypeId;
    private Integer packageId;
}
