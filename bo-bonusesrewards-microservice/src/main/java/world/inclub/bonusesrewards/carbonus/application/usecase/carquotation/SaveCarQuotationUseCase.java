package world.inclub.bonusesrewards.carbonus.application.usecase.carquotation;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.CarQuotation;
import world.inclub.bonusesrewards.shared.utils.filestorage.domain.model.FileResource;

public interface SaveCarQuotationUseCase {

    /**
     * Save a car quotation along with an associated file resource.
     *
     * @param carQuotation The car quotation to be saved.
     * @param fileResource The file resource associated with the car quotation.
     * @return A Mono emitting the saved CarQuotation.
     */
    Mono<CarQuotation> save(CarQuotation carQuotation, FileResource fileResource);

}
