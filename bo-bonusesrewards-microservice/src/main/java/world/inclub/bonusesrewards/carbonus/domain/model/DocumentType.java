package world.inclub.bonusesrewards.carbonus.domain.model;

import lombok.Builder;

@Builder
public record DocumentType(
        Long id,
        String name
) {}
