package world.inclub.bonusesrewards.shared.utils.pagination.infrastructure.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public record PaginationRequest(
        @Nullable @PositiveOrZero Integer page,
        @Nullable @Positive Integer size,
        @Nullable String sortBy,
        @Nullable Boolean asc
) {
}
