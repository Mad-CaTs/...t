package world.inclub.bonusesrewards.carbonus.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.application.usecase.carrankbonus.detail.GetCarRankBonusDetailUseCase;
import world.inclub.bonusesrewards.carbonus.application.usecase.carrankbonus.detail.SearchCarRankBonusDetailUseCase;
import world.inclub.bonusesrewards.carbonus.domain.criteria.CarRankBonusDetailSearchCriteria;
import world.inclub.bonusesrewards.carbonus.domain.model.CarRankBonusDetail;
import world.inclub.bonusesrewards.carbonus.domain.port.CarRankBonusDetailRepositoryPort;
import world.inclub.bonusesrewards.shared.exceptions.EntityNotFoundException;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PageDataBuilder;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PagedData;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CarRankBonusDetailService
        implements SearchCarRankBonusDetailUseCase,
                   GetCarRankBonusDetailUseCase {

    private final CarRankBonusDetailRepositoryPort carRankBonusDetailRepositoryPort;

    @Override
    public Mono<CarRankBonusDetail> getById(UUID id) {
        return carRankBonusDetailRepositoryPort.findById(id)
                .switchIfEmpty(Mono.error(new EntityNotFoundException("CarRankBonusDetail not found with id: " + id)));
    }

    @Override
    public Mono<PagedData<CarRankBonusDetail>> searchCarRankBonusDetails(
            CarRankBonusDetailSearchCriteria criteria,
            Pageable pageable
    ) {
        CarRankBonusDetailSearchCriteria searchCriteria = emptyIfNull(criteria);
        Flux<CarRankBonusDetail> detailsFlux = carRankBonusDetailRepositoryPort.findAll(searchCriteria, pageable)
                .switchIfEmpty(Mono.error(new EntityNotFoundException(
                        "No CarRankBonusDetails found matching the criteria")));
        Mono<Long> countMono = carRankBonusDetailRepositoryPort.countCarRankBonusDetails(searchCriteria);

        return Mono.zip(detailsFlux.collectList(), countMono)
                .map(tuple -> {
                    List<CarRankBonusDetail> details = tuple.getT1();
                    Long total = tuple.getT2();
                    return PageDataBuilder.build(details, pageable, total);
                });
    }

    private CarRankBonusDetailSearchCriteria emptyIfNull(CarRankBonusDetailSearchCriteria criteria) {
        return criteria != null ? criteria : CarRankBonusDetailSearchCriteria.empty();
    }
}
