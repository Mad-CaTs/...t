package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request;

import java.time.LocalDate;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Positive;

public record CarRankBonusDetailSearchRequest(
        @Nullable @Positive Long rankId,
        @Nullable LocalDate startDate,
        @Nullable LocalDate endDate,
        @Nullable Boolean onlyActive
) {
}