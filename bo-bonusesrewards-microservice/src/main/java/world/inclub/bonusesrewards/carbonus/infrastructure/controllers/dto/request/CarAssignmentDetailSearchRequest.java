package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request;

import jakarta.annotation.Nullable;
import lombok.Builder;

import java.time.LocalDate;

@Builder(toBuilder = true)
public record CarAssignmentDetailSearchRequest(
        @Nullable String brandName,
        @Nullable String modelName,
        @Nullable LocalDate startDate,
        @Nullable LocalDate endDate
) {
    public static CarAssignmentDetailSearchRequest empty() {
        return CarAssignmentDetailSearchRequest.builder()
                .build();
    }
}