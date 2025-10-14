package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record CarModelRequest(
        @Size(min = 2) String name,
        @NotNull @Positive Long brandId
) {
}
