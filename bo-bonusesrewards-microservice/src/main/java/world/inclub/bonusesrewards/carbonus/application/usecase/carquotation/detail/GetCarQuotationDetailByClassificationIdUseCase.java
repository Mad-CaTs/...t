package world.inclub.bonusesrewards.carbonus.application.usecase.carquotation.detail;

import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarQuotationDetail;

import java.util.UUID;

public interface GetCarQuotationDetailByClassificationIdUseCase {

    /**
     * Retrieves a flux of car quotation details by classification ID.
     *
     * @param classificationId the classification ID to filter car quotations
     * @return a flux of CarQuotationDetail objects
     */
    Flux<CarQuotationDetail> getByClassificationId(UUID classificationId);

}
