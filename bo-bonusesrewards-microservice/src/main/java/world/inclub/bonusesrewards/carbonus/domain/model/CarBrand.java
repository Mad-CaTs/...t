package world.inclub.bonusesrewards.carbonus.domain.model;

import lombok.Builder;

@Builder(toBuilder = true)
public record CarBrand(
        Long id,
        String name
) {}
