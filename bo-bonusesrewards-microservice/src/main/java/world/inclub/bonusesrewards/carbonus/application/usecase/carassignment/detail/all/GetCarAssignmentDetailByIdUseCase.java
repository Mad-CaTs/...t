package world.inclub.bonusesrewards.carbonus.application.usecase.carassignment.detail.all;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.CarAssignmentDetail;

import java.util.UUID;

public interface GetCarAssignmentDetailByIdUseCase {

    /**
     * Find car assignment detail by id
     *
     * @param id the id of the car assignment detail
     * @return the car assignment detail
     */
    Mono<CarAssignmentDetail> getCarDetails(UUID id);

}
