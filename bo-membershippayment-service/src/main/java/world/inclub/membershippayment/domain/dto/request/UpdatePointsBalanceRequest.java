package world.inclub.membershippayment.domain.dto.request;

import lombok.Data;

@Data
public class UpdatePointsBalanceRequest {
    private int pointsLiberatedDelta;
    private int rewardsDelta;
}
