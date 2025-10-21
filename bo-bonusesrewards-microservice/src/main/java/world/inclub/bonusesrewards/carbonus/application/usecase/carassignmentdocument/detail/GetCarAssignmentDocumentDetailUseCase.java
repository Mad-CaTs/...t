package world.inclub.bonusesrewards.carbonus.application.usecase.carassignmentdocument.detail;

import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarAssignmentDocumentDetail;

import java.util.UUID;

public interface GetCarAssignmentDocumentDetailUseCase {

    /**
     * Retrieves a list of CarAssignmentDocumentDetail by the given car assignment ID.
     *
     * @param carAssignmentId the ID of the car assignment
     * @return a Flux stream of CarAssignmentDocumentDetail
     */
    Flux<CarAssignmentDocumentDetail> getByCarAssignmentId(UUID carAssignmentId);

}
