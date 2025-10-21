package world.inclub.bonusesrewards.carbonus.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarQuotationPendingAssignment;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarQuotationSelected;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

public interface CarQuotationSelectedRepositoryPort {
    Flux<CarQuotationSelected> findWithFilters(
            String member,
            Long rankId,
            Pageable pageable
    );

    Mono<Long> countWithFilters(
            String member,
            Long rankId
    );

    Flux<CarQuotationSelected> findAll(
            String member,
            Long rankId
    );

    Flux<CarQuotationPendingAssignment> getAllPending();
}