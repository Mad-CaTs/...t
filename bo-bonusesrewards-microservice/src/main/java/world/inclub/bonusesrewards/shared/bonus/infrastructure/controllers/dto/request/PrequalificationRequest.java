package world.inclub.bonusesrewards.shared.bonus.infrastructure.controllers.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder(toBuilder = true)
public record PrequalificationRequest(
        @NotNull Long periodMin,
        @NotNull Long periodMax,
        @NotNull Long rankId,
        @NotNull Long minRequalifications
) {}