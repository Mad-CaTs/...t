package world.inclub.bonusesrewards.carbonus.application.usecase.carquotation.detail;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarQuotationSummary;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PagedData;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;


public interface GetCarQuotationSummaryPageableUseCase {

    /**
     * Get all car quotation summaries with optional filters and pagination.
     *
     * @param member     Optional member identifier to filter by member.
     * @param rankId     Optional rank ID to filter by rank.
     * @param isReviewed Optional flag to filter by review status.
     * @param pageable   Pagination information.
     * @return A Mono emitting a paged list of CarQuotationSummary objects.
     */
    Mono<PagedData<CarQuotationSummary>> getAll(
            String member,
            Long rankId,
            Boolean isReviewed,
            Pageable pageable
    );

}
