package world.inclub.bonusesrewards.carbonus.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.application.usecase.carassignment.detail.active.GetAllCarAssignmentsActiveUseCase;
import world.inclub.bonusesrewards.carbonus.application.usecase.carassignment.detail.active.SearchActiveCarAssignmentsUseCase;
import world.inclub.bonusesrewards.carbonus.domain.criteria.CarAssignmentsActiveSearchCriteria;
import world.inclub.bonusesrewards.carbonus.domain.model.CarAssignmentsActive;
import world.inclub.bonusesrewards.carbonus.domain.port.CarAssignmentsActiveRepositoryPort;
import world.inclub.bonusesrewards.shared.exceptions.EntityNotFoundException;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PageDataBuilder;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PagedData;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CarAssignmentsServiceActive
        implements SearchActiveCarAssignmentsUseCase,
                   GetAllCarAssignmentsActiveUseCase {

    private final CarAssignmentsActiveRepositoryPort carAssignmentsActiveRepositoryPort;

    @Override
    public Flux<CarAssignmentsActive> getAll() {
        return carAssignmentsActiveRepositoryPort.findAll()
                .switchIfEmpty(Mono.error(new EntityNotFoundException("No active car assignments found")));
    }

    @Override
    public Mono<PagedData<CarAssignmentsActive>> searchActiveCarAssignments(
            CarAssignmentsActiveSearchCriteria criteria,
            Pageable pageable
    ) {
        CarAssignmentsActiveSearchCriteria searchCriteria = emptyIfNull(criteria);
        Flux<CarAssignmentsActive> assignmentsFlux = carAssignmentsActiveRepositoryPort
                .findAll(searchCriteria, pageable)
                .switchIfEmpty(Mono.error(new EntityNotFoundException(
                        "No active car assignments found matching the criteria")));
        Mono<Long> countMono = carAssignmentsActiveRepositoryPort.countCarAssignmentsActive(searchCriteria)
                .defaultIfEmpty(0L);

        return Mono.zip(assignmentsFlux.collectList(), countMono)
                .map(tuple -> {
                    List<CarAssignmentsActive> assignments = tuple.getT1();
                    Long total = tuple.getT2();

                    return PageDataBuilder
                            .build(assignments, pageable, total);
                });

    }

    private CarAssignmentsActiveSearchCriteria emptyIfNull(CarAssignmentsActiveSearchCriteria criteria) {
        return criteria != null ? criteria : CarAssignmentsActiveSearchCriteria.empty();
    }
}
