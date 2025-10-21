package world.inclub.bonusesrewards.carbonus.application.usecase.carquotation.detail;

import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarQuotationPendingAssignment;

public interface GetCarQuotationPendingAssignmentUseCase {

    /**
     * Retrieves all car quotation overviews.
     *
     * @return A Flux stream of CarQuotationPendingAssignment objects.
     */
    Flux<CarQuotationPendingAssignment> getAllPending();

}
