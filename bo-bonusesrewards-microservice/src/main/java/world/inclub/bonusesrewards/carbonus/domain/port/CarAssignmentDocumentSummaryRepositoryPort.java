package world.inclub.bonusesrewards.carbonus.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarAssignmentDocumentSummary;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

public interface CarAssignmentDocumentSummaryRepositoryPort {
    Flux<CarAssignmentDocumentSummary> findWithFilters(
            String member,
            Long rankId,
            Integer documentCount,
            Pageable pageable
    );

    Mono<Long> countWithFilters(
            String member,
            Long rankId,
            Integer documentCount
    );
}