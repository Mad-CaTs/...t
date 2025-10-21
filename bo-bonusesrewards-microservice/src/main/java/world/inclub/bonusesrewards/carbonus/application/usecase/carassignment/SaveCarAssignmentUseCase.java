package world.inclub.bonusesrewards.carbonus.application.usecase.carassignment;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.Car;
import world.inclub.bonusesrewards.carbonus.domain.model.CarAssignment;
import world.inclub.bonusesrewards.shared.utils.filestorage.domain.model.FileResource;

public interface SaveCarAssignmentUseCase {

    /**
     * Saves a car assignment along with an associated file resource.
     *
     * @param car           the car associated with the assignment
     * @param carAssignment the car assignment to save
     * @param fileResource  the file resource to associate with the car assignment
     * @return a Mono that completes when the save operation is done
     */
    Mono<Void> saveCarAssignment(Car car, CarAssignment carAssignment, FileResource fileResource);

}
