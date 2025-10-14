package world.inclub.bonusesrewards.carbonus.domain.model;

import lombok.Builder;

@Builder(toBuilder = true)
public record CarModel(
        Long id,
        String name,
        Long brandId
) {}
