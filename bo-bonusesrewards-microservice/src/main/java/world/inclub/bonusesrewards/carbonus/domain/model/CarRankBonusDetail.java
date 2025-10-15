package world.inclub.bonusesrewards.carbonus.domain.model;

import lombok.Builder;
import world.inclub.bonusesrewards.shared.rank.domain.model.Rank;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Builder(toBuilder = true)
public record CarRankBonusDetail(
        UUID id,
        Rank rank,
        BigDecimal monthlyBonus,
        BigDecimal initialBonus,
        BigDecimal bonusPrice,
        Instant issueDate,
        Instant expirationDate,
        CarRankBonusStatus status
) {}