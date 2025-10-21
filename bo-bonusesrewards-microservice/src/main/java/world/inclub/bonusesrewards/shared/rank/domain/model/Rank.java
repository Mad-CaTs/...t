package world.inclub.bonusesrewards.shared.rank.domain.model;

import lombok.Builder;

@Builder(toBuilder = true)
public record Rank(
        Long id,
        String name,
        Integer position
) {
    public static Rank empty() {
        return Rank.builder()
                .id(null)
                .name("Unknown")
                .position(null)
                .build();
    }
}