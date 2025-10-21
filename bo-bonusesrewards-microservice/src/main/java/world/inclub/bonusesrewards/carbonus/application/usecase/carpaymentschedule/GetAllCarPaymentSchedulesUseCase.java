package world.inclub.bonusesrewards.carbonus.application.usecase.carpaymentschedule;

import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.carbonus.domain.model.CarPaymentSchedule;

import java.util.UUID;

public interface GetAllCarPaymentSchedulesUseCase {

    /**
     * Retrieves all car payment schedules associated with a specific car assignment ID.
     *
     * @param carAssignmentId The unique identifier of the car assignment.
     * @return A Flux emitting all CarPaymentSchedule objects associated with the specified car assignment ID.
     */
    Flux<CarPaymentSchedule> findByCarAssignmentId(UUID carAssignmentId);

}
