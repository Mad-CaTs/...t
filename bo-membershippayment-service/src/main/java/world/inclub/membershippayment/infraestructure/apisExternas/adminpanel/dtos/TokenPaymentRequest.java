package world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos;

import lombok.Data;

@Data
public class TokenPaymentRequest {

    private int idSuscription;
    private int idPaymentStar;
    private Boolean isFirstPaymentQuote;
}
