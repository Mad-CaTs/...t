package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request;

import jakarta.annotation.Nullable;
import lombok.Builder;

@Builder
public record CarQuotationSelectedSearchRequest(
        @Nullable String member,
        @Nullable Long rankId
) {}