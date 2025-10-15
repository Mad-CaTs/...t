package world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.bonus.domain.model.BonusRequirement;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.entity.BonusRequirementEntity;

@Component
public class BonusRequirementEntityMapper {

    public BonusRequirement toDomain(BonusRequirementEntity entity) {
        return BonusRequirement.builder()
                .id(entity.getId())
                .rankId(entity.getRankId())
                .bonusTypeId(entity.getBonusTypeId())
                .optionNumber(entity.getOptionNumber())
                .cycles(entity.getCycles())
                .directPoints(entity.getDirectPoints())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public BonusRequirementEntity toEntity(BonusRequirement domain) {
        BonusRequirementEntity entity = new BonusRequirementEntity();
        entity.setId(domain.id());
        entity.setRankId(domain.rankId());
        entity.setBonusTypeId(domain.bonusTypeId());
        entity.setOptionNumber(domain.optionNumber());
        entity.setCycles(domain.cycles());
        entity.setDirectPoints(domain.directPoints());
        entity.setCreatedAt(domain.createdAt());
        entity.setUpdatedAt(domain.updatedAt());
        return entity;
    }
}