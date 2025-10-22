package world.inclub.membershippayment.domain.dto.response;


import lombok.Data;

@Data
public class PointsToRewardsResponse {
    private Integer idUser;

    private Integer convertedPoints;
    private Integer remainingPoints;
    private Integer totalRewards;

    private String message;
}
