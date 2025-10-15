package world.inclub.bonusesrewards.shared.bonus.infrastructure.controllers.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public record BonusRequirementRequest(
        @NotNull @Positive Long rankId,
        @NotNull @Positive Long bonusTypeId,
        @NotNull @Positive Integer optionNumber,
        @NotNull @PositiveOrZero Integer cycles,
        @NotNull @PositiveOrZero Integer directPoints
) {}