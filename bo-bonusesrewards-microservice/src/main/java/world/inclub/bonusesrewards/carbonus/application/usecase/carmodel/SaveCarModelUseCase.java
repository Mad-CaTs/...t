package world.inclub.bonusesrewards.carbonus.application.usecase.carmodel;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.CarModel;

public interface SaveCarModelUseCase {

    /**
     * Saves a new car model.
     *
     * @param carModel The CarModel domain object to save.
     * @return Mono of the saved CarModel.
     */
    Mono<CarModel> saveCarModel(CarModel carModel);

}
