package world.inclub.bonusesrewards.carbonus.application.usecase.carpaymentschedule;

import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.application.dto.CarAssignmentExtraInfoSummary;

import java.util.UUID;

@Component
public interface GetCarAssignmentExtraInfoUseCase {
    Mono<CarAssignmentExtraInfoSummary> getExtraInfo(UUID carAssignmentId);
}
