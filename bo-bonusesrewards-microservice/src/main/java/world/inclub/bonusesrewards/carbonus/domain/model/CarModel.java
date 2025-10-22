package world.inclub.bonusesrewards.carbonus.domain.model;

import lombok.Builder;

@Builder(toBuilder = true)
public record CarModel(
        Long id,
        String name,
        Long brandId
) {
    public static CarModel empty() {
        return CarModel.builder()
                .id(0L)
                .name("Unknown Model")
                .brandId(0L)
                .build();
    }
}
