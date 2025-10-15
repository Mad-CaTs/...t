package world.inclub.bonusesrewards.carbonus.application.usecase.carquotation;

import reactor.core.publisher.Mono;

import java.util.UUID;

public interface DeleteCarQuotationByIdUseCase {

    /**
     * Deletes a car quotation by its ID.
     *
     * @param id the ID of the car quotation to delete
     * @return a Mono that completes when the deletion is done
     */
    Mono<Void> deleteById(UUID id);

}
