package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.model.CarRankBonusDetail;
import world.inclub.bonusesrewards.carbonus.domain.model.CarRankBonusStatus;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarRankBonusEntity;
import world.inclub.bonusesrewards.shared.rank.domain.model.Rank;

@Component
public class CarRankBonusDetailMapper {

    public CarRankBonusDetail toDomain(CarRankBonusEntity entity, Rank rank) {
        if (entity == null) return null;
        rank = rank == null ? Rank.empty().toBuilder().id(entity.getRankId()).build() : rank;
        CarRankBonusStatus status = CarRankBonusStatus.fromId(entity.getStatusId());
        return new CarRankBonusDetail(
                entity.getId(),
                rank,
                entity.getMonthlyBonus(),
                entity.getInitialBonus(),
                entity.getBonusPrice(),
                entity.getIssueDate(),
                entity.getExpirationDate(),
                status
        );
    }

}
