package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carrankbonus;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.model.CarRankBonus;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request.CarRankBonusRequest;
import world.inclub.bonusesrewards.shared.infrastructure.context.TimezoneContext;

import java.time.ZoneId;

@Component
public class CarRankBonusRequestMapper {

    public CarRankBonus toDomain(CarRankBonusRequest request) {
        if (request == null) return null;
        
        ZoneId userZone = TimezoneContext.getTimezone();

        var issueInstant = request.issueDate()
                .atStartOfDay(userZone)
                .toInstant();

        var expirationInstant = request.expirationDate()
                .atStartOfDay(userZone)
                .toInstant();
        
        return CarRankBonus.builder()
                .rankId(request.rankId())
                .monthlyBonus(request.monthlyBonus())
                .initialBonus(request.initialBonus())
                .bonusPrice(request.bonusPrice())
                .issueDate(issueInstant)
                .expirationDate(expirationInstant)
                .build();
    }
}