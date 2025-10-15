package world.inclub.bonusesrewards.carbonus.application.usecase.carquotation;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.CarQuotation;
import world.inclub.bonusesrewards.shared.utils.filestorage.domain.model.FileResource;

import java.util.UUID;

public interface UpdateCarQuotationUseCase {

    /**
     * Update a car quotation by its ID.
     *
     * @param id           the ID of the car quotation to update
     * @param carQuotation the updated car quotation data
     * @param fileResource the associated file resource
     * @return a Mono emitting the updated CarQuotation
     */
    Mono<CarQuotation> update(UUID id, CarQuotation carQuotation, FileResource fileResource);

}
