package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.response;

import world.inclub.bonusesrewards.shared.rank.infrastructure.dto.RankResponse;

import java.math.BigDecimal;
import java.util.UUID;

public record CarRankBonusDetailResponse(
        UUID id,
        BigDecimal monthlyBonus,
        BigDecimal initialBonus,
        BigDecimal bonusPrice,
        String issueDate,
        String expirationDate,
        StatusResponse status,
        RankResponse rank
) {
    public record StatusResponse(
            Long id,
            String name
    ) {}
}