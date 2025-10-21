package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carrankbonus;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.model.CarRankBonus;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request.CarRankBonusRequest;
import world.inclub.bonusesrewards.shared.utils.datetime.DateTimeFormatter;

import java.time.Instant;

@Component
public class CarRankBonusRequestMapper {

    public CarRankBonus toDomain(CarRankBonusRequest request) {
        if (request == null) return null;

        Instant issueInstant = DateTimeFormatter.toStartOfDayInstant(request.issueDate());
        Instant expirationInstant = DateTimeFormatter.toStartOfDayInstant(request.expirationDate());

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