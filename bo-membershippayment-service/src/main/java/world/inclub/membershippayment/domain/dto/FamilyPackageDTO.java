package world.inclub.membershippayment.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class FamilyPackageDTO {
    private Integer idFamilyPackage;
    private String name;
    private String description;
    private Integer idSerie;
}
