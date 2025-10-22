package world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;


@Data
public class ObjModel {
    private PackageDTO packageInfo;
    @JsonProperty("paymentSubType")
    private PaymentSubType paymentSubType;

}
