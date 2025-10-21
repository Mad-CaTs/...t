package world.inclub.wallet.api.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DesaffiliateDTO {

    private Long idaffiliatepay;
    private Boolean isActive;
    private Long idReason;

    private String email;
    private String infoEmail;
    private String name;
    private String lastName;
    private String otherEmail;

    private BigDecimal amountPaid;
    private String membership;
    private String motivo;

}
