package world.inclub.bonusesrewards.shared.bonus.domain.model;

public record Prequalification(
        Long userId,
        Long rankId,
        String rankName,
        Integer numRequalifications,
        Integer totalDirectPoints,
        Long startPeriod,
        Long endPeriod
) {}