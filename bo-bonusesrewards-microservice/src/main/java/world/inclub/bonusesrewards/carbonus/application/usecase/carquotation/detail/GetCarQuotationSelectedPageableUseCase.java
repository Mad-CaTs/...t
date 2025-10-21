package world.inclub.bonusesrewards.carbonus.application.usecase.carquotation.detail;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarQuotationSelected;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PagedData;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;


public interface GetCarQuotationSelectedPageableUseCase {

    /**
     * Get all car quotation selected with optional filters and pagination.
     *
     * @param member     Optional member identifier to filter by member.
     * @param rankId     Optional rank ID to filter by rank.
     * @param pageable   Pagination information.
     * @return A Mono emitting a paged list of CarQuotationSelected objects.
     */
    Mono<PagedData<CarQuotationSelected>> getAll(
            String member,
            Long rankId,
            Pageable pageable
    );

}