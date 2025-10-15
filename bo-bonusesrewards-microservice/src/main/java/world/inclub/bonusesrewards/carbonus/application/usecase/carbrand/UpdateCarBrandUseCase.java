package world.inclub.bonusesrewards.carbonus.application.usecase.carbrand;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.CarBrand;

public interface UpdateCarBrandUseCase {

    /**
     * Updates a CarBrand based on the given CarBrand data.
     *
     * @param id       The CarBrand ID to update.
     * @param carBrand The CarBrand domain object with new values.
     * @return Mono of the updated CarBrand.
     */
    Mono<CarBrand> updateCarBrand(Long id, CarBrand carBrand);

}
