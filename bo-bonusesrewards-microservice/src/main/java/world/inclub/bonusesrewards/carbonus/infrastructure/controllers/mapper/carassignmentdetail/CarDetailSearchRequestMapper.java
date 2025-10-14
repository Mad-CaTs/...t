package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carassignmentdetail;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.criteria.CarAssignmentDetailSearchCriteria;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request.CarAssignmentDetailSearchRequest;
import world.inclub.bonusesrewards.shared.infrastructure.context.TimezoneContext;

import java.time.Instant;
import java.time.LocalTime;
import java.time.ZoneId;

@Component
public class CarDetailSearchRequestMapper {

    public CarAssignmentDetailSearchCriteria toDomain(CarAssignmentDetailSearchRequest request) {
        if (request == null) return CarAssignmentDetailSearchCriteria.empty();

        ZoneId userZone = TimezoneContext.getTimezone();

        Instant startInstant = request.startDate() != null
                ? request.startDate().atStartOfDay(userZone).toInstant()
                : null;

        Instant endInstant = request.endDate() != null
                ? request.endDate().atTime(LocalTime.MAX).atZone(userZone).toInstant()
                : null;

        return CarAssignmentDetailSearchCriteria.builder()
                .brandName(request.brandName())
                .modelName(request.modelName())
                .startDate(startInstant)
                .endDate(endInstant)
                .build();
    }

}