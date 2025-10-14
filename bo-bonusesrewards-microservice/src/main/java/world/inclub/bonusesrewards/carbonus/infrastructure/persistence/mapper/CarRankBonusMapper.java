package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.model.CarRankBonus;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarRankBonusEntity;

@Component
public class CarRankBonusMapper {

    public CarRankBonus toDomain(CarRankBonusEntity entity) {
        if (entity == null) return null;
        return new CarRankBonus(
                entity.getId(),
                entity.getRankId(),
                entity.getMonthlyBonus(),
                entity.getInitialBonus(),
                entity.getBonusPrice(),
                entity.getIssueDate(),
                entity.getExpirationDate(),
                entity.getStatusId(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }

    public CarRankBonusEntity toEntity(CarRankBonus domain) {
        if (domain == null) return null;
        CarRankBonusEntity entity = new CarRankBonusEntity();
        entity.setId(domain.id());
        entity.setRankId(domain.rankId());
        entity.setMonthlyBonus(domain.monthlyBonus());
        entity.setInitialBonus(domain.initialBonus());
        entity.setBonusPrice(domain.bonusPrice());
        entity.setIssueDate(domain.issueDate());
        entity.setExpirationDate(domain.expirationDate());
        entity.setStatusId(domain.statusId());
        entity.setCreatedAt(domain.createdAt());
        entity.setUpdatedAt(domain.updatedAt());
        return entity;
    }

}
