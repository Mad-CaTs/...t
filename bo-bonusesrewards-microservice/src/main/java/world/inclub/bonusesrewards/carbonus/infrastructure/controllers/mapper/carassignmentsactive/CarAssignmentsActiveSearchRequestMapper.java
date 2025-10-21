package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carassignmentsactive;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.criteria.CarAssignmentsActiveSearchCriteria;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request.CarAssignmentsActiveSearchRequest;
import world.inclub.bonusesrewards.shared.utils.datetime.DateTimeFormatter;

import java.time.Instant;

@Component
public class CarAssignmentsActiveSearchRequestMapper {

    public CarAssignmentsActiveSearchCriteria toDomain(CarAssignmentsActiveSearchRequest request) {
        if (request == null) return CarAssignmentsActiveSearchCriteria.empty();

        Instant startInstant = DateTimeFormatter.toStartOfDayInstant(request.startDate());
        Instant endInstant = DateTimeFormatter.toEndOfDayInstant(request.endDate());

        return CarAssignmentsActiveSearchCriteria.builder()
                .member(request.member())
                .modelName(request.modelName())
                .startDate(startInstant)
                .endDate(endInstant)
                .build();
    }
}