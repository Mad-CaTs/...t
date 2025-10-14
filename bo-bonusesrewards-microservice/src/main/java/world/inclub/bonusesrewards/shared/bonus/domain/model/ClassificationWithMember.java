package world.inclub.bonusesrewards.shared.bonus.domain.model;

import java.time.Instant;
import java.util.UUID;

public record ClassificationWithMember(
        UUID classificationId,
        Long memberId,
        String username,
        String fullName,
        String countryOfResidence,
        String email,
        String phone,
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