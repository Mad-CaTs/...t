package world.inclub.bonusesrewards.carbonus.application.usecase.carmodel;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.CarModel;

public interface UpdateCarModelUseCase {

    /**
     * Updates a CarModel based on the given CarModel data.
     *
     * @param id       The CarModel ID to update.
     * @param carModel The CarModel domain object with new values.
     * @return Mono of the updated CarModel.
     */
    Mono<CarModel> updateCarModel(Long id, CarModel carModel);

}
