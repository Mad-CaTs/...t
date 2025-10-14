package world.inclub.bonusesrewards.shared.bonus.infrastructure.controllers.dto.response;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record BonusCampaignResponse(
        UUID id,
        Long bonusTypeId,
        String bonusTypeCode,
        String name,
        String description,
        Integer year,
        String startDate,
        String endDate
) {}