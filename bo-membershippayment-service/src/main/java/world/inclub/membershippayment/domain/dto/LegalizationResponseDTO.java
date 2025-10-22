package world.inclub.membershippayment.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LegalizationResponseDTO {
    private Integer id;
    private Integer idFamilyPackage;
    private String familyPackageName;
    private String nameSuscription;
    private Integer idStatus;
    private Integer contractStatus;   // 1 o 0
    private Integer certificateStatus; // 1 o 0
}
