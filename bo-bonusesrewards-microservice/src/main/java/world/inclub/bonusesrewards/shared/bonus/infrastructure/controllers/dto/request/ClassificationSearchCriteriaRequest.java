package world.inclub.bonusesrewards.shared.bonus.infrastructure.controllers.dto.request;

import jakarta.annotation.Nullable;

public record ClassificationSearchCriteriaRequest(
        @Nullable String member,
        @Nullable Long rankId,
        @Nullable Boolean notificationStatus
) {}