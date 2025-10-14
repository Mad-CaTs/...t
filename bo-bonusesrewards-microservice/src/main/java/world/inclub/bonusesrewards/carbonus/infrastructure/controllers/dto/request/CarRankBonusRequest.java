package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CarRankBonusRequest(
        @NotNull(message = "Rank ID is required")
        Long rankId,

        @NotNull @PositiveOrZero (message = "Monthly bonus is required")
        BigDecimal monthlyBonus,

        @NotNull @PositiveOrZero(message = "Initial bonus is required")
        BigDecimal initialBonus,

        @NotNull @PositiveOrZero(message = "Bonus price is required")
        BigDecimal bonusPrice,

        @NotNull(message = "Issue date is required")
        LocalDate issueDate,

        @NotNull(message = "Expiration date is required")
        LocalDate expirationDate
) {
}