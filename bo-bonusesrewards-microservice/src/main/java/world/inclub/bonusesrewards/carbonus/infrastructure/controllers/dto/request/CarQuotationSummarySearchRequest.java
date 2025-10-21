package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request;

import jakarta.annotation.Nullable;
import lombok.Builder;

@Builder
public record CarQuotationSummarySearchRequest(
        @Nullable String member,
        @Nullable Long rankId,
        @Nullable Boolean isReviewed
) {}