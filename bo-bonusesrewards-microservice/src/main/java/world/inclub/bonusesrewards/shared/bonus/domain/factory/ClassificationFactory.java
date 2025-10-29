package world.inclub.bonusesrewards.shared.bonus.domain.factory;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.bonus.domain.model.Classification;

import java.time.Instant;

@Component
public class ClassificationFactory {

    public Classification create(
            Long memberId,
            Long rankId,
            Long achievedPoints,
            Long requiredPoints,
            Integer requalificationCycles,
            Long startPeriodId,
            Long endPeriodId
    ) {
        return Classification.builder()
                .memberId(memberId)
                .rankId(rankId)
                .achievedPoints(achievedPoints)
                .requiredPoints(requiredPoints)
                .requalificationCycles(requalificationCycles)
                .classificationDate(Instant.now())
                .startPeriodId(startPeriodId)
                .endPeriodId(endPeriodId)
                .notificationStatus(false)
                .build();
    }

    public Classification markNotified(Classification existingClassification) {
        return existingClassification.toBuilder()
                .notificationStatus(true)
                .build();
    }

}