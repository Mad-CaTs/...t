package world.inclub.bonusesrewards.carbonus.domain.criteria;

import lombok.Builder;

import java.time.Instant;

@Builder(toBuilder = true)
public record CarRankBonusDetailSearchCriteria(
        Long rankId,
        Instant startDate,
        Instant endDate,
        Boolean onlyActive,
        Instant currentDate
) {
    public static CarRankBonusDetailSearchCriteria empty() {
        return CarRankBonusDetailSearchCriteria.builder()
                .build();
    }
}