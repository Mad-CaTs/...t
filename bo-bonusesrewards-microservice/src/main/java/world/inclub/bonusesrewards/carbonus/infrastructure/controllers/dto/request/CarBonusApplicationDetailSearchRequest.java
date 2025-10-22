package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request;

import jakarta.annotation.Nullable;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDate;

@Builder
public record CarBonusApplicationDetailSearchRequest(
        @Nullable String member,
        @Nullable LocalDate appliedDate,
        @Nullable BigDecimal bonusAmount,
        @Nullable Boolean onlyInitial
) {}