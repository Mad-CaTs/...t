package world.inclub.bonusesrewards.shared.rank.domain.model;

import lombok.Builder;

@Builder
public record Rank(
        Long id,
        String name
) {}