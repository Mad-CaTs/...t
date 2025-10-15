package world.inclub.bonusesrewards.carbonus.application.usecase.carmodel;

import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.carbonus.domain.model.CarModel;

public interface GetAllCarModelsUseCase {

    /**
     * Retrieves all car models.
     *
     * @return Flux of CarModel domain objects.
     */
    Flux<CarModel> getAllCarModels();

}