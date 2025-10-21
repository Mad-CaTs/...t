package world.inclub.bonusesrewards.carbonus.application.usecase.carpaymentschedule;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.CarPaymentSchedule;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PagedData;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

import java.util.UUID;

public interface SearchCarPaymentSchedulesUseCase {

    /**
     * Searches for car payment schedules associated with a specific car assignment ID, with pagination support.
     *
     * @param carAssignmentId The unique identifier of the car assignment.
     * @param pageable        The pagination settings including page number and size.
     * @return A Mono emitting a PagedData object containing the list of car payment schedules
     * associated with the specified car assignment ID and pagination details.
     */
    Mono<PagedData<CarPaymentSchedule>> searchCarPaymentSchedules(UUID carAssignmentId, Pageable pageable);

}