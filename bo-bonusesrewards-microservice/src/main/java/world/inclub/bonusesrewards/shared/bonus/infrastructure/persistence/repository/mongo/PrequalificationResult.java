package world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.repository.mongo;

import org.springframework.data.mongodb.core.mapping.Field;

public record PrequalificationResult(
        @Field("_id") Long userId,
        @Field("id_range") Long rankId,
        @Field("range") String rankName,
        Integer numRequalifications,
        Integer totalDirectPoints,
        Long startPeriod,
        Long endPeriod
) {}