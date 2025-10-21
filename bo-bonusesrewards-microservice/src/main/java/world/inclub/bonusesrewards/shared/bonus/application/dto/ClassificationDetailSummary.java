package world.inclub.bonusesrewards.shared.bonus.application.dto;

import lombok.Builder;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Builder(toBuilder = true)
public record ClassificationDetailSummary(
        UUID classificationId,
        UUID carAssignmentId,
        Long rankId,
        String rankName,
        Integer maxAchievedPoints,
        Integer requiredPoints,
        BigDecimal initialBonus,
        BigDecimal monthlyBonus,
        BigDecimal bonusPrice,
        List<Option> options
) {
    public record Option(
            Integer optionNumber,
            Integer cycles,
            Integer achievedPoints,
            Integer requiredPoints,
            Boolean isAchieved
    ) {}
}
