package world.inclub.membershippayment.domain.dto.request;

import lombok.Data;

@Data
public class PointsToRewardsRequest {
    private Integer idUser;
    private Integer idFamily;;
    private Integer pointsToConvert;
}
