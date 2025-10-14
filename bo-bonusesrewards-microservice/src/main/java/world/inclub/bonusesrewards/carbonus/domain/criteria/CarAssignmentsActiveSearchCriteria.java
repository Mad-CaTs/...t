package world.inclub.bonusesrewards.carbonus.domain.criteria;

import lombok.Builder;

import java.time.Instant;

@Builder(toBuilder = true)
public record CarAssignmentsActiveSearchCriteria(
        String member,
        String modelName,
        Instant startDate,
        Instant endDate
) {
    public static CarAssignmentsActiveSearchCriteria empty() {
        return CarAssignmentsActiveSearchCriteria.builder()
                .build();
    }
}