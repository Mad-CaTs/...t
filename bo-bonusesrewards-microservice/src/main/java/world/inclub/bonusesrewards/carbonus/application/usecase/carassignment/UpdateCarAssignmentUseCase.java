package world.inclub.bonusesrewards.carbonus.application.usecase.carassignment;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.Car;
import world.inclub.bonusesrewards.carbonus.domain.model.CarAssignment;
import world.inclub.bonusesrewards.shared.utils.filestorage.domain.model.FileResource;

import java.util.UUID;

public interface UpdateCarAssignmentUseCase {

    /**
     * Update a car assignment.
     *
     * @param carAssignmentId The ID of the car assignment to update.
     * @param car             The car associated with the assignment.
     * @param carAssignment   The updated car assignment details.
     * @param fileResource    The file resource associated with the car assignment.
     * @return A Mono that completes when the update is done.
     */
    Mono<Void> updateCarAssignment(
            UUID carAssignmentId,
            Car car,
            CarAssignment carAssignment,
            FileResource fileResource
    );

}
