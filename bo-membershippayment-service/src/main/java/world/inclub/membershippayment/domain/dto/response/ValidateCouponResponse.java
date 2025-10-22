package world.inclub.membershippayment.domain.dto.response;

import lombok.Data;

@Data
public class ValidateCouponResponse {
    private boolean esValido;
    private String mensaje;
    private Integer porcentajeDescuento;
}
