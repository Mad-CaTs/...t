package world.inclub.membershippayment.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.PackageDetail;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.PackageDTO;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PackageInfo {
    private PackageDTO packageDTO;
    private PackageDetail packageDetail;
    private FamilyPackageDTO familyPackage;
}
