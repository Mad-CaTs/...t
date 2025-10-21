package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carrankbonusdetail;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.criteria.CarRankBonusDetailSearchCriteria;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request.CarRankBonusDetailSearchRequest;
import world.inclub.bonusesrewards.shared.utils.datetime.DateTimeFormatter;

import java.time.Instant;
import java.time.LocalDate;

@Component
public class CarRankBonusDetailSearchRequestMapper {

    public CarRankBonusDetailSearchCriteria toDomain(CarRankBonusDetailSearchRequest request) {
        if (request == null)
            return CarRankBonusDetailSearchCriteria.empty();

        Instant startInstant = DateTimeFormatter.toStartOfDayInstant(request.startDate());
        Instant endInstant = DateTimeFormatter.toEndOfDayInstant(request.endDate());
        Instant currentInstant = DateTimeFormatter.toEndOfDayInstant(LocalDate.now());

        return CarRankBonusDetailSearchCriteria.builder()
                .rankId(request.rankId())
                .startDate(startInstant)
                .endDate(endInstant)
                .onlyActive(request.onlyActive())
                .currentDate(currentInstant)
                .build();
    }
}