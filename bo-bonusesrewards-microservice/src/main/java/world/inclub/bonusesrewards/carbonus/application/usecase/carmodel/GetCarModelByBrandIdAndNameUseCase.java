package world.inclub.bonusesrewards.carbonus.application.usecase.carmodel;

import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.carbonus.domain.model.CarModel;

public interface GetCarModelByBrandIdAndNameUseCase {

    /**
     * Finds car models by brand ID and name (partial or full match).
     *
     * @param brandId The brand ID to filter by.
     * @param name The name to search for.
     * @return Flux of matching CarModel domain objects.
     */
    Flux<CarModel> getCarModelByBrandIdAndName(Long brandId, String name);

}
