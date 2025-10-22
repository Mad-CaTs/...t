package world.inclub.membershippayment.domain.dto.response;

import lombok.Data;

@Data
public class UserFamilyPointsDTO {
    private int idFamily;
    private String familyName;
    private int liberatedPoints;
    private int rewards;
}
