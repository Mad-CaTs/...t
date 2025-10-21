package world.inclub.wallet.api.dtos;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AffiliatePayDTO {
    private int iduser;
    private Long idsuscription;
    private String namePackage;
    private Long idPackage;
    private Long numberQuotas;
    private BigDecimal amount;
    private String dateExpiration;
    private Boolean isActive;
    private String description;
}
