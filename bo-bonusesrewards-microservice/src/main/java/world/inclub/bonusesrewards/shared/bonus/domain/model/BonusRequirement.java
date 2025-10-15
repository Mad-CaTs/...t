package world.inclub.bonusesrewards.shared.bonus.domain.model;

import lombok.Builder;

import java.time.Instant;
import java.util.UUID;

@Builder(toBuilder = true)
public record BonusRequirement(
        UUID id,
        Long rankId,
        Long bonusTypeId,
        Integer optionNumber,
        Integer cycles,
        Integer directPoints,
        Instant createdAt,
        Instant updatedAt
) {}
