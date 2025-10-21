package world.inclub.bonusesrewards.shared.bonus.domain.model;

import lombok.Builder;

@Builder(toBuilder = true)
public record Prequalification(
        Long userId,
        Long rankId,
        String rankName,
        Integer numRequalifications,
        Integer totalDirectPoints,
        Long startPeriod,
        Long endPeriod
) {
    public static Prequalification empty() {
        return Prequalification.builder().build();
    }
}