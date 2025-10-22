package world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import world.inclub.membershippayment.domain.dto.MembershipVersionDTO;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PackageDetail {

    private Long idPackageDetail;

    private Integer idPackage;

    private Integer monthsDuration;
    private BigDecimal price;

    private Integer numberQuotas;

    private BigDecimal initialPrice;
    private BigDecimal quotaPrice;
    private BigDecimal volume;
    private BigDecimal volumeByFee;
    private BigDecimal volumeRibera;
    private Integer numberInitialQuote;
    private BigDecimal comission;
    private Integer numberShares;
    @JsonProperty("idFamilyPackage")
    private Integer familyPackageId;
    @JsonProperty("idMembershipVersion")
    private Integer membershipVercionId;
    @JsonProperty("membershipMaintenance")
    private BigDecimal membershipMainTenance;
    private MembershipVersionDTO membershipVersion;
    private Boolean  isSpecialFractional;
    private Boolean isFamilyBonus;
    private Integer points;
    private Integer installmentInterval;
    private Integer pointsToRelease;
}