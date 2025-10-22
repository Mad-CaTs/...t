package world.inclub.membershippayment.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FamilyPackageDTO {
    private Integer idFamilyPackage;
    private String name;
    private String description;
}