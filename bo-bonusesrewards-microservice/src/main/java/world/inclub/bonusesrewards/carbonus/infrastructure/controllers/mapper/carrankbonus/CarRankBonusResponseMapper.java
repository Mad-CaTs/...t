package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carrankbonus;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.model.CarRankBonus;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.response.CarRankBonusResponse;
import world.inclub.bonusesrewards.shared.utils.datetime.DateTimeFormatter;

@Component
public class CarRankBonusResponseMapper {

    public CarRankBonusResponse toResponse(CarRankBonus domain) {
        if (domain == null) return null;

        return new CarRankBonusResponse(
                domain.id(),
                domain.rankId(),
                domain.monthlyBonus(),
                domain.initialBonus(),
                domain.bonusPrice(),
                DateTimeFormatter.formatInstantWithContext(domain.issueDate()),
                DateTimeFormatter.formatInstantWithContext(domain.expirationDate()),
                domain.statusId()
        );
    }
}