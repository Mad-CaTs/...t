package world.inclub.bonusesrewards.shared.bonus.infrastructure.controllers.dto.response;

import java.util.UUID;

public record ClassificationResponse(
        UUID classificationId,
        Long memberId,
        String username,
        String fullName,
        String countryOfResidence,
        String rankName,
        String currentRankName,
        Long achievedPoints,
        Long requiredPoints,
        Integer requalificationCycles,
        String classificationDate,
        Boolean notificationStatus,
        String startDate,
        String endDate
) {}