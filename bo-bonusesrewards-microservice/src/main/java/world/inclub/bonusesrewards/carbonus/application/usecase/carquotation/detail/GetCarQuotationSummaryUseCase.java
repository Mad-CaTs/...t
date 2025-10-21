package world.inclub.bonusesrewards.carbonus.application.usecase.carquotation.detail;

import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarQuotationSummary;


public interface GetCarQuotationSummaryUseCase {

    /**
     * Get all car quotation summaries with optional filters.
     *
     * @param member     Optional member identifier to filter by member.
     * @param rankId     Optional rank ID to filter by rank.
     * @param isReviewed Optional flag to filter by review status.
     * @return A Flux emitting a list of CarQuotationSummary objects.
     */
    Flux<CarQuotationSummary> getAll(
            String member,
            Long rankId,
            Boolean isReviewed
    );

}
