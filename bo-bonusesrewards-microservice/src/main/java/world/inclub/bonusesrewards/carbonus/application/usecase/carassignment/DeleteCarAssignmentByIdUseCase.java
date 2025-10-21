package world.inclub.bonusesrewards.carbonus.application.usecase.carassignment;

import reactor.core.publisher.Mono;

import java.util.UUID;

public interface DeleteCarAssignmentByIdUseCase {

    /**
     * Deletes a car assignment by its ID.
     *
     * @param carAssignmentId the ID of the car assignment to delete
     * @return a Mono that completes when the deletion is done
     */
    Mono<Void> deleteById(UUID carAssignmentId);

}
