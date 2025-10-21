package world.inclub.bonusesrewards.carbonus.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.application.usecase.carquotation.detail.*;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarQuotationDetail;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarQuotationPendingAssignment;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarQuotationSelected;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarQuotationSummary;
import world.inclub.bonusesrewards.carbonus.domain.port.CarQuotationDetailRepositoryPort;
import world.inclub.bonusesrewards.carbonus.domain.port.CarQuotationSelectedRepositoryPort;
import world.inclub.bonusesrewards.carbonus.domain.port.CarQuotationSummaryRepositoryPort;
import world.inclub.bonusesrewards.shared.exceptions.EntityNotFoundException;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PageDataBuilder;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PagedData;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CarQuotationDetailService
        implements GetCarQuotationDetailByClassificationIdUseCase,
                   GetCarQuotationSummaryPageableUseCase,
                   GetCarQuotationSummaryUseCase,
                   GetCarQuotationSelectedPageableUseCase,
                   GetCarQuotationSelectedUseCase,
                   GetCarQuotationPendingAssignmentUseCase {

    private final CarQuotationDetailRepositoryPort carQuotationDetailRepositoryPort;
    private final CarQuotationSummaryRepositoryPort carQuotationSummaryRepositoryPort;
    private final CarQuotationSelectedRepositoryPort carQuotationSelectedRepositoryPort;

    @Override
    public Flux<CarQuotationDetail> getByClassificationId(UUID classificationId) {
        return carQuotationDetailRepositoryPort.findByClassificationId(classificationId)
                .switchIfEmpty(Flux.error(new EntityNotFoundException(
                        "Quotation details not found for classification id: " + classificationId)));
    }

    @Override
    public Mono<PagedData<CarQuotationSummary>> getAll(
            String member,
            Long rankId,
            Boolean isReviewed,
            Pageable pageable
    ) {
        Flux<CarQuotationSummary> classificationsFlux = carQuotationSummaryRepositoryPort
                .findWithFilters(member, rankId, isReviewed, pageable)
                .switchIfEmpty(Flux.error(
                        new EntityNotFoundException("No quotation summaries found")));

        Mono<Long> countMono = carQuotationSummaryRepositoryPort
                .countWithFilters(member, rankId, isReviewed)
                .defaultIfEmpty(0L);

        return Mono.zip(classificationsFlux.collectList(), countMono)
                .map(tuple -> {
                    List<CarQuotationSummary> summaries = tuple.getT1();
                    Long totalElements = tuple.getT2();

                    return PageDataBuilder.build(summaries, pageable, totalElements);
                });
    }

    @Override
    public Flux<CarQuotationSummary> getAll(String member, Long rankId, Boolean isReviewed) {
        return carQuotationSummaryRepositoryPort
                .findAll(member, rankId, isReviewed)
                .switchIfEmpty(Flux.error(
                        new EntityNotFoundException("No quotation summaries found")));
    }

    @Override
    public Mono<PagedData<CarQuotationSelected>> getAll(
            String member,
            Long rankId,
            Pageable pageable
    ) {
        Flux<CarQuotationSelected> selectedFlux = carQuotationSelectedRepositoryPort
                .findWithFilters(member, rankId, pageable)
                .switchIfEmpty(Flux.error(
                        new EntityNotFoundException("No quotation selected found")));

        Mono<Long> countMono = carQuotationSelectedRepositoryPort
                .countWithFilters(member, rankId)
                .defaultIfEmpty(0L);

        return Mono.zip(selectedFlux.collectList(), countMono)
                .map(tuple -> {
                    List<CarQuotationSelected> selected = tuple.getT1();
                    Long totalElements = tuple.getT2();

                    return PageDataBuilder.build(selected, pageable, totalElements);
                });
    }

    @Override
    public Flux<CarQuotationSelected> getAll(String member, Long rankId) {
        return carQuotationSelectedRepositoryPort
                .findAll(member, rankId)
                .switchIfEmpty(Flux.error(
                        new EntityNotFoundException("No quotation selected found")));
    }

    @Override
    public Flux<CarQuotationPendingAssignment> getAllPending() {
        return carQuotationSelectedRepositoryPort
                .getAllPending()
                .switchIfEmpty(Flux.error(
                        new EntityNotFoundException("Quotation overview found")));
    }

}
