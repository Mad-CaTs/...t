package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carassignmentdetail;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.criteria.CarAssignmentDetailSearchCriteria;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request.CarAssignmentDetailSearchRequest;
import world.inclub.bonusesrewards.shared.utils.datetime.DateTimeFormatter;

import java.time.Instant;

@Component
public class CarDetailSearchRequestMapper {

    public CarAssignmentDetailSearchCriteria toDomain(CarAssignmentDetailSearchRequest request) {
        if (request == null) return CarAssignmentDetailSearchCriteria.empty();

        Instant startInstant = DateTimeFormatter.toStartOfDayInstant(request.startDate());
        Instant endInstant = DateTimeFormatter.toEndOfDayInstant(request.endDate());

        return CarAssignmentDetailSearchCriteria.builder()
                .brandName(request.brandName())
                .modelName(request.modelName())
                .startDate(startInstant)
                .endDate(endInstant)
                .build();
    }

}