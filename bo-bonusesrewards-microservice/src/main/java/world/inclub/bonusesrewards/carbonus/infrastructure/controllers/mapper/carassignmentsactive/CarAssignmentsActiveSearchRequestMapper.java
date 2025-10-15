package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carassignmentsactive;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.criteria.CarAssignmentsActiveSearchCriteria;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request.CarAssignmentsActiveSearchRequest;
import world.inclub.bonusesrewards.shared.infrastructure.context.TimezoneContext;

import java.time.Instant;
import java.time.LocalTime;
import java.time.ZoneId;

@Component
public class CarAssignmentsActiveSearchRequestMapper {

    public CarAssignmentsActiveSearchCriteria toDomain(CarAssignmentsActiveSearchRequest request) {
        if (request == null) return CarAssignmentsActiveSearchCriteria.empty();

        ZoneId userZone = TimezoneContext.getTimezone();

        Instant startInstant = request.startDate() != null
                ? request.startDate().atStartOfDay(userZone).toInstant()
                : null;

        Instant endInstant = request.endDate() != null
                ? request.endDate().atTime(LocalTime.MAX).atZone(userZone).toInstant()
                : null;

        return CarAssignmentsActiveSearchCriteria.builder()
                .member(request.member())
                .modelName(request.modelName())
                .startDate(startInstant)
                .endDate(endInstant)
                .build();
    }
}