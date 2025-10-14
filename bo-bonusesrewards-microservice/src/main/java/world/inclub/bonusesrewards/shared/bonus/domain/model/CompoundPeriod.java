package world.inclub.bonusesrewards.shared.bonus.domain.model;

import lombok.Builder;

@Builder(toBuilder = true)
public record CompoundPeriod(
        String id,
        Long userId,
        Long rankId,
        String rankName,
        Long periodId,
        Double pointsBranch1,
        Double pointsBranch2,
        Double pointsBranch3,
        Double directPointsBranch1,
        Double directPointsBranch2,
        Double directPointsBranch3,
        Long stateId
) {}
