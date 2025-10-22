package world.inclub.membershippayment.domain.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SuscriptionCouponRequest {

    private Integer idUser;
    private Integer idSalary;
    private Integer idSubscription;
    private BigDecimal discountPercentage;
    private String code;
    private LocalDateTime dateStart;
    private LocalDateTime dateEnd;
    private Boolean state;
    private Integer idBusiness;
    private Boolean isPartner;
}
