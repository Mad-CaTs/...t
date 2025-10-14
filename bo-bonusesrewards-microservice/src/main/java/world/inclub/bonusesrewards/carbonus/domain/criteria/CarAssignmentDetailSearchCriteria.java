package world.inclub.bonusesrewards.carbonus.domain.criteria;

import lombok.Builder;

import java.time.Instant;

@Builder(toBuilder = true)
public record CarAssignmentDetailSearchCriteria(
        String brandName,
        String modelName,
        Instant startDate,
        Instant endDate
) {
    public static CarAssignmentDetailSearchCriteria empty() {
        return CarAssignmentDetailSearchCriteria.builder()
                .build();
    }
}