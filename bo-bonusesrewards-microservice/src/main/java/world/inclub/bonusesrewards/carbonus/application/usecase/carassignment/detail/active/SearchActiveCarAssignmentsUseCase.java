package world.inclub.bonusesrewards.carbonus.application.usecase.carassignment.detail.active;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.criteria.CarAssignmentsActiveSearchCriteria;
import world.inclub.bonusesrewards.carbonus.domain.model.CarAssignmentsActive;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PagedData;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

public interface SearchActiveCarAssignmentsUseCase {

    /**
     * Searches for active car assignments based on the provided criteria and pagination settings.
     *
     * @param criteria The search criteria to filter active car assignments.
     * @param pageable The pagination settings including page number and size.
     * @return A Mono emitting a PagedData object containing the list of active car assignments
     * and pagination details.
     */
    Mono<PagedData<CarAssignmentsActive>> searchActiveCarAssignments(
            CarAssignmentsActiveSearchCriteria criteria,
            Pageable pageable
    );

}