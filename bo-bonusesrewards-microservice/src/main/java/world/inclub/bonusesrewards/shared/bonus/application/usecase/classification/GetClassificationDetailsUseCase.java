package world.inclub.bonusesrewards.shared.bonus.application.usecase.classification;

import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.shared.bonus.application.dto.ClassificationDetailSummary;

public interface GetClassificationDetailsUseCase {

    /**
     * Retrieves detailed classification information for a specific member and bonus type.
     *
     * @param memberId  the ID of the member whose classification details are to be retrieved
     * @param bonusType the type of bonus for which the classification details are relevant
     * @return a Flux stream of ClassificationDetailSummary objects containing detailed classification information
     */
    Flux<ClassificationDetailSummary> getDetails(Long memberId, String bonusType);

}
