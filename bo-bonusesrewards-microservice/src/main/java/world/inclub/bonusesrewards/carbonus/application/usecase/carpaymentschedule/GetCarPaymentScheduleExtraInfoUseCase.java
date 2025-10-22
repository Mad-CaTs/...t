package world.inclub.bonusesrewards.carbonus.application.usecase.carpaymentschedule;

import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.application.dto.CarPaymentScheduleExtraInfoSummary;

import java.util.UUID;

@Component
public interface GetCarPaymentScheduleExtraInfoUseCase {
    Mono<CarPaymentScheduleExtraInfoSummary> getExtraInfo(UUID carAssignmentId);
}
