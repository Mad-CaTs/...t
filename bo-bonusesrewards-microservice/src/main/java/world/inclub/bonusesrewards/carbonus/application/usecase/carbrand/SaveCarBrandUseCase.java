package world.inclub.bonusesrewards.carbonus.application.usecase.carbrand;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.CarBrand;

public interface SaveCarBrandUseCase {

    /**
     * Saves a new car brand.
     *
     * @param carBrand The CarBrand domain object to save.
     * @return Mono of the saved CarBrand.
     */
    Mono<CarBrand> saveCarBrand(CarBrand carBrand);

}
