package world.inclub.bonusesrewards.carbonus.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarBonusApplicationDetail;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

import java.math.BigDecimal;
import java.time.Instant;

public interface CarBonusApplicationDetailRepositoryPort {
    Flux<CarBonusApplicationDetail> findWithFilters(
            String member,
            Instant appliedDate,
            BigDecimal bonusAmount,
            Boolean onlyInitial,
            Pageable pageable
    );

    Mono<Long> countWithFilters(
            String member,
            Instant appliedDate,
            BigDecimal bonusAmount,
            Boolean onlyInitial
    );

    Flux<CarBonusApplicationDetail> findAll(
            String member,
            Instant appliedDate,
            BigDecimal bonusAmount,
            Boolean onlyInitial
    );
}