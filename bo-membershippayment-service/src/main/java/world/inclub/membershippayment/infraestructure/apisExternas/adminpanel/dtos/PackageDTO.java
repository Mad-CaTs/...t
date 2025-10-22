package world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import world.inclub.membershippayment.domain.dto.FamilyPackageDTO;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class PackageDTO {
    private Integer idPackage;
    private String name;
    private String codeMembership;
    private String description;
    private Integer idFamilyPackage;
    private Integer status;
    private List<PackageDetail> packageDetail;
    private FamilyPackageDTO family;
}