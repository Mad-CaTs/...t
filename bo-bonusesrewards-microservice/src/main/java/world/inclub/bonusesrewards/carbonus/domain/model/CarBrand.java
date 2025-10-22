package world.inclub.bonusesrewards.carbonus.domain.model;

import lombok.Builder;

@Builder(toBuilder = true)
public record CarBrand(
        Long id,
        String name
) {
    public static CarBrand empty() {
        return CarBrand.builder()
                .id(0L)
                .name("Unknown Brand")
                .build();
    }
}
