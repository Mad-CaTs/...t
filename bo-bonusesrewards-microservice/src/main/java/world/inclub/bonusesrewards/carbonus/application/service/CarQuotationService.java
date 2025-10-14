package world.inclub.bonusesrewards.carbonus.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.application.usecase.carquotation.*;
import world.inclub.bonusesrewards.carbonus.domain.factory.CarQuotationFactory;
import world.inclub.bonusesrewards.carbonus.domain.model.CarQuotation;
import world.inclub.bonusesrewards.carbonus.domain.port.CarQuotationRepositoryPort;
import world.inclub.bonusesrewards.carbonus.domain.validator.CarQuotationValidator;
import world.inclub.bonusesrewards.shared.utils.filestorage.domain.model.FileContext;
import world.inclub.bonusesrewards.shared.utils.filestorage.domain.model.FileResource;
import world.inclub.bonusesrewards.shared.utils.filestorage.domain.port.FileStoragePort;
import world.inclub.bonusesrewards.shared.exceptions.EntityNotFoundException;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CarQuotationService
        implements SaveCarQuotationUseCase,
                   UpdateCarQuotationUseCase,
                   DeleteCarQuotationByIdUseCase {

    private final CarQuotationRepositoryPort carQuotationRepositoryPort;
    private final FileStoragePort fileStoragePort;
    private final CarQuotationFactory carQuotationFactory;
    private final CarQuotationValidator carQuotationValidator;

    @Override
    public Mono<CarQuotation> save(CarQuotation carQuotation, FileResource fileResource) {
        return carQuotationRepositoryPort
                .countByClassificationId(carQuotation.classificationId())
                .doOnNext(carQuotationValidator::validateQuotationCreation)
                .flatMap(count -> fileStoragePort
                        .save(fileResource, FileContext.QUOTATION)
                        .flatMap(imageUrl -> {
                            CarQuotation carQuotationToSave = carQuotationFactory.create(carQuotation, imageUrl);
                            return carQuotationRepositoryPort.save(carQuotationToSave);
                        })
                );
    }

    @Override
    public Mono<CarQuotation> update(UUID id, CarQuotation carQuotation, FileResource fileResource) {
        return carQuotationRepositoryPort.findById(id)
                .switchIfEmpty(Mono.error(new EntityNotFoundException("Quotation not found with id: " + id)))
                .flatMap(existingQuotation -> fileStoragePort.save(fileResource, FileContext.QUOTATION)
                        .flatMap(imageUrl -> {
                            CarQuotation updatedQuotation = carQuotationFactory.update(existingQuotation,
                                                                                       carQuotation,
                                                                                       imageUrl);
                            return carQuotationRepositoryPort.save(updatedQuotation);
                        })
                );
    }

    @Override
    public Mono<Void> deleteById(UUID id) {
        return carQuotationRepositoryPort.findById(id)
                .switchIfEmpty(Mono.error(new EntityNotFoundException("Quotation not found with id: " + id)))
                .flatMap(existingQuotation -> carQuotationRepositoryPort.deleteById(id));
    }
}
