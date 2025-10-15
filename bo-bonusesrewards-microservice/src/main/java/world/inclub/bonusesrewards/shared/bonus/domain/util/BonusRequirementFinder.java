package world.inclub.bonusesrewards.shared.bonus.domain.util;

import world.inclub.bonusesrewards.shared.bonus.domain.model.BonusRequirement;

import java.util.Comparator;
import java.util.List;

public class BonusRequirementFinder {

    public static BonusRequirement findMatchingRequirement(
            List<BonusRequirement> bonusRequirements,
            Long rankId,
            Integer numRequalifications
    ) {
        return bonusRequirements.stream()
                .filter(r -> r.rankId().equals(rankId))
                .filter(r -> r.cycles() >= numRequalifications)
                .min(Comparator.comparing(BonusRequirement::cycles))
                .orElseGet(() -> bonusRequirements.stream()
                        .filter(r -> r.rankId().equals(rankId))
                        .max(Comparator.comparing(BonusRequirement::cycles))
                        .orElse(null)
                );
    }
}