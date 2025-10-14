package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request;

import jakarta.annotation.Nullable;
import lombok.Builder;

import java.time.LocalDate;

@Builder(toBuilder = true)
public record CarAssignmentsActiveSearchRequest(
        @Nullable String member,
        @Nullable String modelName,
        @Nullable LocalDate startDate,
        @Nullable LocalDate endDate
) {
}