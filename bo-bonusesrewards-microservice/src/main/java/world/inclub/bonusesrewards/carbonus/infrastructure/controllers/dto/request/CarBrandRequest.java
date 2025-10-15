package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request;

import jakarta.validation.constraints.Size;

public record CarBrandRequest(
        @Size(min = 2) String name
) {
}
