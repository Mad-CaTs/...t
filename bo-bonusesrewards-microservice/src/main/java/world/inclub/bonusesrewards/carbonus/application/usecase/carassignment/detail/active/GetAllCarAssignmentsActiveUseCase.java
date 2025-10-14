package world.inclub.bonusesrewards.carbonus.application.usecase.carassignment.detail.active;

import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.carbonus.domain.model.CarAssignmentsActive;

public interface GetAllCarAssignmentsActiveUseCase {

    /**
     * Get all active car assignments
     *
     * @return a Flux emitting all active car assignments
     */
    Flux<CarAssignmentsActive> getAll();

}