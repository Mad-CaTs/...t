package world.inclub.bonusesrewards.carbonus.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.application.usecase.carassignment.detail.all.*;
import world.inclub.bonusesrewards.carbonus.domain.model.CarAssignmentDetail;
import world.inclub.bonusesrewards.carbonus.domain.criteria.CarAssignmentDetailSearchCriteria;
import world.inclub.bonusesrewards.carbonus.domain.port.CarDetailsRepositoryPort;
import world.inclub.bonusesrewards.shared.exceptions.EntityNotFoundException;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PageDataBuilder;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PagedData;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CarAssignmentDetailService
        implements GetCarAssignmentDetailByIdUseCase,
                   SearchCarAssignmentDetailsUseCase {

    private final CarDetailsRepositoryPort carDetailsRepositoryPort;

    @Override
    public Mono<CarAssignmentDetail> getCarDetails(UUID id) {
        return carDetailsRepositoryPort.findByIdWithDetails(id)
                .switchIfEmpty(Mono.error(new EntityNotFoundException("Car assignment not found with id: " + id)));
    }

    @Override
    public Mono<PagedData<CarAssignmentDetail>> searchCarDetails(CarAssignmentDetailSearchCriteria criteria, Pageable pageable) {
        CarAssignmentDetailSearchCriteria searchCriteria = emptyIfNull(criteria);
        Flux<CarAssignmentDetail> carDetailsFlux = carDetailsRepositoryPort
                .searchCarsWithDetails(searchCriteria, pageable)
                .switchIfEmpty(Mono.error(new EntityNotFoundException(
                        "No assignments found matching the search criteria.")));
        Mono<Long> totalCountMono = countCars(searchCriteria)
                .defaultIfEmpty(0L);

        return Mono.zip(carDetailsFlux.collectList(), totalCountMono)
                .map(tuple -> {
                    List<CarAssignmentDetail> carDetailsList = tuple.getT1();
                    Long totalCount = tuple.getT2();

                    return PageDataBuilder.build(
                            carDetailsList,
                            pageable,
                            totalCount
                    );
                });
    }

    private Mono<Long> countCars(CarAssignmentDetailSearchCriteria criteria) {
        CarAssignmentDetailSearchCriteria searchCriteria = emptyIfNull(criteria);
        return carDetailsRepositoryPort.countCarsWithDetails(searchCriteria);
    }

    private CarAssignmentDetailSearchCriteria emptyIfNull(CarAssignmentDetailSearchCriteria criteria) {
        return criteria != null ? criteria : CarAssignmentDetailSearchCriteria.empty();
    }

}