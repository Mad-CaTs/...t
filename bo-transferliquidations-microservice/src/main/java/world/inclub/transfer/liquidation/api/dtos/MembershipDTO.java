package world.inclub.transfer.liquidation.api.dtos;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MembershipDTO {
    private Integer idPackage;
    private Integer idPackageDetail;
    private Integer status;
    private Integer idMembership;
    private BigDecimal points;
    private BigDecimal pointsByFee;
    private Integer pay;
    private String namePackage;
}
