package world.inclub.bonusesrewards.shared.bonus.domain.model;

import lombok.Builder;

import java.time.Instant;
import java.util.UUID;

@Builder
public record Classification(
        UUID id,
        Long memberId,
        Long rankId,
        Long achievedPoints,
        Long requiredPoints,
        Integer requalificationCycles,
        Instant classificationDate,
        Long startPeriodId,
        Long endPeriodId,
        Boolean notificationStatus,
        Instant createdAt,
        Instant updatedAt
) {}