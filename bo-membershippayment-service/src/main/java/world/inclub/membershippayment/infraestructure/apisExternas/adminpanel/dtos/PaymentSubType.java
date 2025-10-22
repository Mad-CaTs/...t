package world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaymentSubType {

    @JsonProperty("idPaymentSubType")
    private Integer idSubPaymentType;
    private Integer idPaymentType;
    private String description;
    private BigDecimal commissionSoles;
    private BigDecimal commissionDollars;
    private BigDecimal ratePercentage;
    private Boolean statusSoles;
    private Boolean statusDollar;
}