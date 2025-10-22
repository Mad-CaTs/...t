package world.inclub.bonusesrewards.carbonus.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.application.usecase.carbonusapplication.*;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarBonusApplicationDetail;
import world.inclub.bonusesrewards.carbonus.domain.port.CarBonusApplicationDetailRepositoryPort;
import world.inclub.bonusesrewards.shared.exceptions.EntityNotFoundException;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PageDataBuilder;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PagedData;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CarBonusApplicationDetailService
        implements GetPagedCarBonusApplicationsUseCase,
                   ListAllCarBonusApplicationsUseCase {
    private final CarBonusApplicationDetailRepositoryPort carBonusApplicationDetailRepositoryPort;


    @Override
    public Mono<PagedData<CarBonusApplicationDetail>> getBonusApplicationDetails(
            String member,
            Instant appliedDate,
            BigDecimal bonusAmount,
            Boolean onlyInitial,
            Pageable pageable
    ) {
        Flux<CarBonusApplicationDetail> detailsFlux = carBonusApplicationDetailRepositoryPort
                .findWithFilters(member, appliedDate, bonusAmount, onlyInitial, pageable)
                .switchIfEmpty(Flux.error(
                        new EntityNotFoundException("No bonus application details found")));

        Mono<Long> countMono = carBonusApplicationDetailRepositoryPort
                .countWithFilters(member, appliedDate, bonusAmount, onlyInitial)
                .defaultIfEmpty(0L);

        return Mono.zip(detailsFlux.collectList(), countMono)
                .map(tuple -> {
                    List<CarBonusApplicationDetail> details = tuple.getT1();
                    Long totalElements = tuple.getT2();

                    return PageDataBuilder.build(details, pageable, totalElements);
                });
    }

    @Override
    public Flux<CarBonusApplicationDetail> getBonusApplicationDetails(
            String member,
            Instant appliedDate,
            BigDecimal bonusAmount,
            Boolean onlyInitial
    ) {
        return carBonusApplicationDetailRepositoryPort
                .findAll(member, appliedDate, bonusAmount, onlyInitial)
                .switchIfEmpty(Flux.error(
                        new EntityNotFoundException("No bonus application details found")));
    }

}
