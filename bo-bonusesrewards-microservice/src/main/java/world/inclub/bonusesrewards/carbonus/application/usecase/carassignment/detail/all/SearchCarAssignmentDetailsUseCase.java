package world.inclub.bonusesrewards.carbonus.application.usecase.carassignment.detail.all;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.CarAssignmentDetail;
import world.inclub.bonusesrewards.carbonus.domain.criteria.CarAssignmentDetailSearchCriteria;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PagedData;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

public interface SearchCarAssignmentDetailsUseCase {

    /**
     * Search for car assignment details based on the provided criteria and pagination settings.
     *
     * @param criteria The search criteria to filter car assignment details.
     * @param pageable The pagination settings.
     * @return A Mono emitting a PagedData object containing the search results.
     */
    Mono<PagedData<CarAssignmentDetail>> searchCarDetails(
            CarAssignmentDetailSearchCriteria criteria,
            Pageable pageable
    );

}