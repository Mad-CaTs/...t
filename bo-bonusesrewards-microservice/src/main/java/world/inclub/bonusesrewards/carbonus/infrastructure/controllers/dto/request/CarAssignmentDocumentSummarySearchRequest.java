package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request;

import jakarta.annotation.Nullable;
import lombok.Builder;

@Builder(toBuilder = true)
public record CarAssignmentDocumentSummarySearchRequest(
        @Nullable String member,
        @Nullable Long rankId,
        @Nullable Integer documentCount
) {}