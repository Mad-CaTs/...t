package world.inclub.bonusesrewards.shared.bonus.infrastructure.controllers.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.bonus.domain.model.BonusRequirement;
import world.inclub.bonusesrewards.shared.bonus.domain.model.BonusType;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.controllers.dto.request.BonusRequirementRequest;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.controllers.dto.response.BonusRequirementResponse;

@Component
public class BonusRequirementControllerMapper {

    public BonusRequirement toDomain(BonusRequirementRequest request) {
        return BonusRequirement.builder()
                .rankId(request.rankId())
                .bonusTypeId(request.bonusTypeId())
                .optionNumber(request.optionNumber())
                .cycles(request.cycles())
                .directPoints(request.directPoints())
                .build();
    }

    public BonusRequirementResponse toResponse(BonusRequirement domain) {
        BonusRequirementResponse.BonusTypeResponse bonusTypeResponse = toBonusTypeResponse(domain);
        return new BonusRequirementResponse(
                domain.id(),
                domain.rankId(),
                bonusTypeResponse,
                domain.optionNumber(),
                domain.cycles(),
                domain.directPoints()
        );
    }

    private BonusRequirementResponse.BonusTypeResponse toBonusTypeResponse(BonusRequirement domain) {
        if (domain == null) return null;

        BonusType bonusType = BonusType.fromId(domain.bonusTypeId());
        return new BonusRequirementResponse.BonusTypeResponse(
                bonusType.getId(),
                bonusType.getCode()
        );
    }

}