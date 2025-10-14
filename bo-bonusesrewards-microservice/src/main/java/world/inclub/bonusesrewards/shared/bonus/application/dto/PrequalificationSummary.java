package world.inclub.bonusesrewards.shared.bonus.application.dto;

import java.time.LocalDate;

public record PrequalificationSummary(
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
        Long missingPoints,
        LocalDate startDate,
        LocalDate endDate,
        Integer requalificationCycles
) {}
