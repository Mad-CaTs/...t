package world.inclub.bonusesrewards.carbonus.application.usecase.carbrand;

import reactor.core.publisher.Mono;

public interface DeleteCarBrandByIdUseCase {

    /**
     * Deletes a car brand by its ID.
     *
     * @param id The CarBrand ID to delete.
     * @return Mono<Void> indicating completion.
     */
    Mono<Void> deleteCarBrandById(Long id);

}