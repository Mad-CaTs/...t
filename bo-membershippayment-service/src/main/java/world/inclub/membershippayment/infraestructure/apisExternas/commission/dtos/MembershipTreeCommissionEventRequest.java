package world.inclub.membershippayment.infraestructure.apisExternas.commission.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MembershipTreeCommissionEventRequest {

    private Integer idSuscription;
    private Integer idSocio;
    private Integer typeCommission;


}
