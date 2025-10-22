package world.inclub.membershippayment.infraestructure.apisExternas.tree.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Membership {
    private Integer idPackage;
    private Integer idPackageDetail;
    private Integer status;
    private Integer idMembership;
    private String namePackage;
    private BigDecimal points;
    private BigDecimal pointsByFee;
    private Integer pay;
    private Integer idUser;
}
