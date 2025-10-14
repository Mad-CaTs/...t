package world.inclub.bonusesrewards.carbonus.application.usecase.carbrand;

import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.carbonus.domain.model.CarBrand;

public interface GetCarBrandByNameUseCase {

    /**
     * Finds car brands by name (partial or full match).
     *
     * @param name The name to search for.
     * @return Flux of matching CarBrand domain objects.
     */
    Flux<CarBrand> getCarBrandByName(String name);

}
