package world.inclub.bonusesrewards.carbonus.domain.model;

import lombok.Builder;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Represents the car rank bonus model for the Car Bonus system.
 * Defines the available bonuses according to the member's rank
 */
@Builder(toBuilder = true)
public record CarRankBonus(
        UUID id,
        Long rankId,
        BigDecimal monthlyBonus,
        BigDecimal initialBonus,
        BigDecimal bonusPrice,
        Instant issueDate,
        Instant expirationDate,
        Long statusId,
        Instant createdAt,
        Instant updatedAt
) {
    public static CarRankBonus empty() {
        return CarRankBonus.builder().build();
    }
}