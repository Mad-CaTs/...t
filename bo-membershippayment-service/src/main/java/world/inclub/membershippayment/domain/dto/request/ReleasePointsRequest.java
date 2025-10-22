package world.inclub.membershippayment.domain.dto.request;

import lombok.Data;

@Data
public class ReleasePointsRequest {
    private Integer idUser;
    private Integer idSuscription;
    private Integer pointsToRelease;
}
