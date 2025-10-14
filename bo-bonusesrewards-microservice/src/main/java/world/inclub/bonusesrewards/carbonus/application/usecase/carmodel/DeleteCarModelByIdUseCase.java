package world.inclub.bonusesrewards.carbonus.application.usecase.carmodel;

import reactor.core.publisher.Mono;

public interface DeleteCarModelByIdUseCase {

    /**
     * Deletes a car model by its ID.
     *
     * @param id The CarModel ID to delete.
     * @return Mono<Void> indicating completion.
     */
    Mono<Void> deleteCarModelById(Long id);

}