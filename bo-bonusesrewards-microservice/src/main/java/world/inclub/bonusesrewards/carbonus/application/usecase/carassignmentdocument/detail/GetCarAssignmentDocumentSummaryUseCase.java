package world.inclub.bonusesrewards.carbonus.application.usecase.carassignmentdocument.detail;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarAssignmentDocumentSummary;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PagedData;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

public interface GetCarAssignmentDocumentSummaryUseCase {

    /**
     * Retrieves a paginated list of car assignment document summaries based on the provided filters.
     *
     * @param member        Optional filter by member username or name.
     * @param rankId        Optional filter by member rank ID.
     * @param documentCount Optional filter by the number of documents.
     * @param pageable      Pagination information including page number, size, and sorting.
     * @return A Mono emitting a PagedData object containing CarAssignmentDocumentSummary items.
     */
    Mono<PagedData<CarAssignmentDocumentSummary>> getAll(
            String member,
            Long rankId,
            Integer documentCount,
            Pageable pageable
    );
}
