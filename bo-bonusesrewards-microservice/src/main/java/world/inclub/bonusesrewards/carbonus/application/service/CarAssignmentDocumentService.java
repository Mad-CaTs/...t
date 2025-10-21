package world.inclub.bonusesrewards.carbonus.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.application.usecase.carassignmentdocument.*;
import world.inclub.bonusesrewards.carbonus.application.usecase.carassignmentdocument.detail.*;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarAssignmentDocumentDetail;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarAssignmentDocumentSummary;
import world.inclub.bonusesrewards.carbonus.domain.factory.CarAssignmentDocumentFactory;
import world.inclub.bonusesrewards.carbonus.domain.model.CarAssignmentDocument;
import world.inclub.bonusesrewards.carbonus.domain.port.CarAssignmentDocumentDetailRepositoryPort;
import world.inclub.bonusesrewards.carbonus.domain.port.CarAssignmentDocumentRepositoryPort;
import world.inclub.bonusesrewards.carbonus.domain.port.CarAssignmentDocumentSummaryRepositoryPort;
import world.inclub.bonusesrewards.shared.exceptions.EntityNotFoundException;
import world.inclub.bonusesrewards.shared.utils.filestorage.domain.model.FileContext;
import world.inclub.bonusesrewards.shared.utils.filestorage.domain.model.FileResource;
import world.inclub.bonusesrewards.shared.utils.filestorage.domain.port.FileStoragePort;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PageDataBuilder;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PagedData;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CarAssignmentDocumentService
        implements CreateCarAssignmentDocumentUseCase,
                   UpdateCarAssignmentDocumentUseCase,
                   DeleteCarAssignmentDocumentUseCase,
                   GetCarAssignmentDocumentDetailUseCase,
                   GetCarAssignmentDocumentSummaryUseCase {

    private final CarAssignmentDocumentRepositoryPort carAssignmentDocumentRepositoryPort;
    private final CarAssignmentDocumentDetailRepositoryPort carAssignmentDocumentDetailRepositoryPort;
    private final CarAssignmentDocumentSummaryRepositoryPort carAssignmentDocumentSummaryRepositoryPort;
    private final FileStoragePort fileStoragePort;
    private final CarAssignmentDocumentFactory carAssignmentDocumentFactory;

    @Override
    public Mono<CarAssignmentDocument> create(CarAssignmentDocument document, FileResource fileResource) {
        return fileStoragePort.save(fileResource, FileContext.DOCUMENT)
                .flatMap(fileUrl -> carAssignmentDocumentRepositoryPort
                        .save(carAssignmentDocumentFactory
                                      .create(document, fileResource, fileUrl)));
    }

    @Override
    public Mono<CarAssignmentDocument> update(UUID id, CarAssignmentDocument document, FileResource fileResource) {
        return carAssignmentDocumentRepositoryPort.findById(id)
                .flatMap(existing -> {
                    Mono<String> fileUrlMono = fileResource != null
                            ? fileStoragePort.save(fileResource, FileContext.DOCUMENT)
                            : Mono.just(existing.fileUrl());
                    return fileUrlMono.flatMap(fileUrl -> {
                        CarAssignmentDocument updatedDocument = carAssignmentDocumentFactory
                                .update(existing, document, fileResource, fileUrl);
                        return carAssignmentDocumentRepositoryPort.save(updatedDocument);
                    });
                });
    }

    @Override
    public Mono<Void> deleteById(UUID id) {
        return carAssignmentDocumentRepositoryPort.findById(id)
                .switchIfEmpty(Mono.error(new RuntimeException("Car Assignment Document not found with id: " + id)))
                .flatMap(existing -> carAssignmentDocumentRepositoryPort.deleteById(id));
    }


    @Override
    public Flux<CarAssignmentDocumentDetail> getByCarAssignmentId(UUID carAssignmentId) {
        return carAssignmentDocumentDetailRepositoryPort.findByCarAssignmentId(carAssignmentId)
                .switchIfEmpty(Flux.error(new EntityNotFoundException(
                        "No document details found for Car Assignment ID: " + carAssignmentId)));
    }

    @Override
    public Mono<PagedData<CarAssignmentDocumentSummary>> getAll(
            String member,
            Long rankId,
            Integer documentCount,
            Pageable pageable
    ) {
        Flux<CarAssignmentDocumentSummary> summariesFlux = carAssignmentDocumentSummaryRepositoryPort
                .findWithFilters(member, rankId, documentCount, pageable)
                .switchIfEmpty(Flux.error(
                        new EntityNotFoundException("No document summaries found")));

        Mono<Long> countMono = carAssignmentDocumentSummaryRepositoryPort
                .countWithFilters(member, rankId, documentCount)
                .defaultIfEmpty(0L);

        return Mono.zip(summariesFlux.collectList(), countMono)
                .map(tuple -> {
                    List<CarAssignmentDocumentSummary> summaries = tuple.getT1();
                    Long totalElements = tuple.getT2();

                    return PageDataBuilder.build(summaries, pageable, totalElements);
                });
    }

}