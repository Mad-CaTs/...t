package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.response;

import java.math.BigDecimal;
import java.util.UUID;

public record CarRankBonusResponse(
        UUID id,
        Long rankId,
        BigDecimal monthlyBonus,
        BigDecimal initialBonus,
        BigDecimal bonusPrice,
        String issueDate,
        String expirationDate,
        Long statusId
) {
}