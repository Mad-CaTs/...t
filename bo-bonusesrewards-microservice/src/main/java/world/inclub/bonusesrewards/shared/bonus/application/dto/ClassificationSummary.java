package world.inclub.bonusesrewards.shared.bonus.application.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record ClassificationSummary(
        UUID classificationId,
        Long memberId,
        String username,
        String fullName,
        String countryOfResidence,
        String email,
        String phone,
        String rankName,
        String currentRankName,
        Long achievedPoints,
        Long requiredPoints,
        Integer requalificationCycles,
        Instant classificationDate,
        Boolean notificationStatus,
        LocalDate startDate,
        LocalDate endDate
) {}