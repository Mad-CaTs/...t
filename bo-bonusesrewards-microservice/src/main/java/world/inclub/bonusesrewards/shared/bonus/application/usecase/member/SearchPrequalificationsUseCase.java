package world.inclub.bonusesrewards.shared.bonus.application.usecase.member;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.bonus.application.dto.PrequalificationSummary;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PagedData;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

public interface SearchPrequalificationsUseCase {

    /**
     * Searches for prequalifications based on the provided criteria and pagination settings.
     *
     * @param periodMin The minimum period to filter by.
     * @param periodMax The maximum period to filter by.
     * @param rankId The rank ID to filter by.
     * @param minRequalifications The minimum number of requalifications to filter by.
     * @param pageable The pagination settings including page number and size.
     * @return A Mono emitting a PagedData object containing the list of prequalifications
     * and pagination details.
     */
    Mono<PagedData<PrequalificationSummary>> searchPrequalifications(
            Long periodMin,
            Long periodMax,
            Long rankId,
            Long minRequalifications,
            Pageable pageable
    );

}