package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarBonusApplicationDetail;
import world.inclub.bonusesrewards.carbonus.domain.port.CarBonusApplicationDetailRepositoryPort;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.mapper.CarBonusApplicationDetailViewEntityMapper;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository.CarBonusApplicationDetailR2dbcRepository;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

import java.math.BigDecimal;
import java.time.Instant;

@Repository
@RequiredArgsConstructor
public class CarBonusApplicationDetailRepositoryAdapter
        implements CarBonusApplicationDetailRepositoryPort {

    private final CarBonusApplicationDetailR2dbcRepository carBonusApplicationDetailR2dbcRepository;
    private final CarBonusApplicationDetailViewEntityMapper carBonusApplicationDetailViewEntityMapper;


    @Override
    public Flux<CarBonusApplicationDetail> findWithFilters(
            String member,
            Instant appliedDate,
            BigDecimal bonusAmount,
            Boolean onlyInitial,
            Pageable pageable
    ) {
        return carBonusApplicationDetailR2dbcRepository
                .findWithFilters(member, appliedDate, bonusAmount, onlyInitial, pageable.limit(), pageable.offset())
                .map(carBonusApplicationDetailViewEntityMapper::toDomain);
    }

    @Override
    public Mono<Long> countWithFilters(
            String member,
            Instant appliedDate,
            BigDecimal bonusAmount,
            Boolean onlyInitial
    ) {
        return carBonusApplicationDetailR2dbcRepository
                .countWithFilters(member, appliedDate, bonusAmount, onlyInitial);
    }

    @Override
    public Flux<CarBonusApplicationDetail> findAll(
            String member,
            Instant appliedDate,
            BigDecimal bonusAmount,
            Boolean onlyInitial
    ) {
        return carBonusApplicationDetailR2dbcRepository
                .findAllWithFilters(member, appliedDate, bonusAmount, onlyInitial)
                .map(carBonusApplicationDetailViewEntityMapper::toDomain);
    }
}