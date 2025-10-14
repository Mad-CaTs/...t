package world.inclub.bonusesrewards.shared.bonus.infrastructure.controllers.dto.response;

import java.util.List;

public record BonusCampaignWithRequirementsResponse(
        BonusCampaignResponse campaign,
        List<BonusRequirementResponse> requirements
) {}