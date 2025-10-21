package world.inclub.bonusesrewards.carbonus.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarQuotationSummary;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

public interface CarQuotationSummaryRepositoryPort {
    Flux<CarQuotationSummary> findWithFilters(
            String member,
            Long rankId,
            Boolean isReviewed,
            Pageable pageable
    );

    Mono<Long> countWithFilters(
            String member,
            Long rankId,
            Boolean isReviewed
    );

    Flux<CarQuotationSummary> findAll(
            String member,
            Long rankId,
            Boolean isReviewed
    );
}
