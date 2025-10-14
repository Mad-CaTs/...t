package world.inclub.bonusesrewards.shared.bonus.infrastructure.controllers.dto.response;

import java.util.UUID;

public record BonusRequirementResponse(
        UUID id,
        Long rankId,
        BonusTypeResponse bonusType,
        Integer optionNumber,
        Integer cycles,
        Integer directPoints
) {
    public record BonusTypeResponse(
            Long id,
            String name
    ) {}
}