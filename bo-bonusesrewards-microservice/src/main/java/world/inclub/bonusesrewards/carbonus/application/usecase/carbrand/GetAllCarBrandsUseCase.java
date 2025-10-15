package world.inclub.bonusesrewards.carbonus.application.usecase.carbrand;

import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.carbonus.domain.model.CarBrand;

public interface GetAllCarBrandsUseCase {

    /**
     * Retrieves all car brands.
     *
     * @return Flux of CarBrand domain objects.
     */
    Flux<CarBrand> getAllCarBrands();

}
