package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carrankbonusdetail;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.criteria.CarRankBonusDetailSearchCriteria;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request.CarRankBonusDetailSearchRequest;
import world.inclub.bonusesrewards.shared.infrastructure.context.TimezoneContext;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;

@Component
public class CarRankBonusDetailSearchRequestMapper {

    public CarRankBonusDetailSearchCriteria toDomain(CarRankBonusDetailSearchRequest request) {
        if (request == null)
            return CarRankBonusDetailSearchCriteria.empty();

        ZoneId userZone = TimezoneContext.getTimezone();

        Instant startInstant = request.startDate() != null
                ? request.startDate().atStartOfDay(userZone).toInstant()
                : null;

        Instant endInstant = request.endDate() != null
                ? request.endDate().atTime(LocalTime.MAX).atZone(userZone).toInstant()
                : null;

        Instant currentInstant = LocalDate.now(userZone)
                .atTime(LocalTime.MAX)
                .atZone(userZone)
                .toInstant();

        return CarRankBonusDetailSearchCriteria.builder()
                .rankId(request.rankId())
                .startDate(startInstant)
                .endDate(endInstant)
                .onlyActive(request.onlyActive())
                .currentDate(currentInstant)
                .build();
    }
}