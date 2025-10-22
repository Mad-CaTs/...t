package world.inclub.membershippayment.domain.dto;

import lombok.Data;
import world.inclub.membershippayment.domain.entity.TokenPayment;
@Data
public class TokenPaymentResponseDTO extends TokenPayment{
    private int idUser;
    private boolean isPayLatter;
}
