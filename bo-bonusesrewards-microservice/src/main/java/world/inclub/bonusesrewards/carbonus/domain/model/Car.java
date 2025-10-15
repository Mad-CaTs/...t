package world.inclub.bonusesrewards.carbonus.domain.model;

import lombok.Builder;

import java.time.Instant;
import java.util.UUID;

@Builder(toBuilder = true)
public record Car(
        UUID id,
        Long brandId,
        Long modelId,
        String color,
        String imageUrl,
        Instant createdAt,
        Instant updatedAt
) {}
