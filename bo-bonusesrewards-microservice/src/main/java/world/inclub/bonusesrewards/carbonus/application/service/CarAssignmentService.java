package world.inclub.bonusesrewards.carbonus.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.application.usecase.carassignment.*;
import world.inclub.bonusesrewards.carbonus.domain.factory.CarAssignmentFactory;
import world.inclub.bonusesrewards.carbonus.domain.factory.CarFactory;
import world.inclub.bonusesrewards.carbonus.domain.factory.CarPaymentScheduleFactory;
import world.inclub.bonusesrewards.carbonus.domain.model.*;
import world.inclub.bonusesrewards.carbonus.domain.port.*;
import world.inclub.bonusesrewards.carbonus.domain.validator.CarAssignmentValidator;
import world.inclub.bonusesrewards.shared.bonus.domain.model.Classification;
import world.inclub.bonusesrewards.shared.bonus.domain.port.ClassificationRepositoryPort;
import world.inclub.bonusesrewards.shared.utils.filestorage.domain.model.FileContext;
import world.inclub.bonusesrewards.shared.utils.filestorage.domain.model.FileResource;
import world.inclub.bonusesrewards.shared.utils.filestorage.domain.port.FileStoragePort;
import world.inclub.bonusesrewards.shared.exceptions.EntityNotFoundException;
import world.inclub.bonusesrewards.shared.member.domain.port.MemberRepositoryPort;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CarAssignmentService
        implements SaveCarAssignmentUseCase,
                   UpdateCarAssignmentUseCase,
                   DeleteCarAssignmentByIdUseCase {

    private final CarRepositoryPort carRepositoryPort;
    private final CarAssignmentRepositoryPort carAssignmentRepositoryPort;
    private final MemberRepositoryPort memberRepositoryPort;
    private final CarPaymentScheduleRepositoryPort carPaymentScheduleRepositoryPort;
    private final CarRankBonusRepositoryPort carRankBonusRepositoryPort;
    private final CarQuotationRepositoryPort carQuotationRepositoryPort;
    private final ClassificationRepositoryPort classificationRepositoryPort;
    private final FileStoragePort fileStoragePort;
    private final CarAssignmentValidator carAssignmentValidator;
    private final CarFactory carFactory;
    private final CarAssignmentFactory carAssignmentFactory;
    private final CarPaymentScheduleFactory carPaymentScheduleFactory;

    @Override
    public Mono<Void> saveCarAssignment(
            Car car,
            CarAssignment carAssignment,
            FileResource fileResource
    ) {
        carAssignmentValidator.validatePaymentDay(carAssignment);
        return validateMemberExists(carAssignment.memberId())
                .then(saveImage(fileResource))
                .flatMap(imageUrl -> carAssignment.quotationId() != null
                        ? processCarAssignmentWithQuotation
                        (car, carAssignment, imageUrl, null, null, false)
                        : processCarAssignmentWithoutQuotation
                        (car, carAssignment, imageUrl, null, null, false)
                );
    }

    @Override
    public Mono<Void> updateCarAssignment(
            UUID carAssignmentId,
            Car car,
            CarAssignment carAssignment,
            FileResource fileResource
    ) {
        return carAssignmentRepositoryPort.findById(carAssignmentId)
                .switchIfEmpty(Mono.error(new EntityNotFoundException("Assignment not found with id: " + carAssignmentId)))
                .doOnNext(carAssignmentValidator::validateCanBeUpdated)
                .flatMap(existingAssignment -> carRepositoryPort.findById(existingAssignment.carId())
                        .switchIfEmpty(Mono.error(new EntityNotFoundException("Car not found with id: " + existingAssignment.carId())))
                        .flatMap(existingCar -> validateMemberExists(carAssignment.memberId())
                                .then(saveImage(fileResource))
                                .flatMap(imageUrl -> carAssignment.quotationId() != null
                                        ? processCarAssignmentWithQuotation
                                        (car, carAssignment, imageUrl, existingCar, existingAssignment, true)
                                        : processCarAssignmentWithoutQuotation
                                        (car, carAssignment, imageUrl, existingCar, existingAssignment, true)
                                )
                        )
                );
    }

    @Override
    public Mono<Void> deleteById(UUID carAssignmentId) {
        return carAssignmentRepositoryPort.findById(carAssignmentId)
                .switchIfEmpty(Mono.error(new EntityNotFoundException("Car assignment not found with id: " + carAssignmentId)))
                .doOnNext(carAssignmentValidator::validateCanBeDeleted)
                .flatMap(carAssignment ->
                                 carAssignmentRepositoryPort.deleteById(carAssignmentId)
                                         .then(carRepositoryPort.deleteById(carAssignment.carId()))
                );
    }

    private Mono<Void> processCarAssignmentWithQuotation(
            Car car,
            CarAssignment carAssignment,
            String imageUrl,
            Car existingCar,
            CarAssignment existingAssignment,
            boolean isUpdate
    ) {
        return getClassificationByQuotationId(carAssignment.quotationId())
                .flatMap(classification -> getRankBonus(classification)
                        .flatMap(rankBonus -> {
                            Car carToProcess = isUpdate
                                    ? carFactory.updateCar(car, existingCar, imageUrl)
                                    : carFactory.createCar(car, imageUrl);

                            return carRepositoryPort.save(carToProcess)
                                    .flatMap(savedCar -> {
                                        CarAssignment carAssignmentToProcess = isUpdate
                                                ? carAssignmentFactory
                                                .prepareForUpdate(carAssignment,
                                                                  existingAssignment,
                                                                  rankBonus,
                                                                  classification)
                                                : carAssignmentFactory
                                                .prepareForSave(carAssignment, savedCar, rankBonus, classification);

                                        return carAssignmentRepositoryPort.save(carAssignmentToProcess)
                                                .flatMap(savedAssignment ->
                                                                 createInitialPaymentSchedules(savedAssignment.id(),
                                                                                               savedAssignment,
                                                                                               rankBonus));
                                    });
                        })
                );
    }

    private Mono<Void> processCarAssignmentWithoutQuotation(
            Car car,
            CarAssignment carAssignment,
            String imageUrl,
            Car existingCar,
            CarAssignment existingAssignment,
            boolean isUpdate
    ) {
        Car carToProcess = isUpdate
                ? carFactory.updateCar(car, existingCar, imageUrl)
                : carFactory.createCar(car, imageUrl);

        return carRepositoryPort.save(carToProcess)
                .flatMap(savedCar -> {
                    CarAssignment carAssignmentToProcess = isUpdate
                            ? carAssignmentFactory.prepareForUpdate(carAssignment, existingAssignment, null, null)
                            : carAssignmentFactory.prepareForSave(carAssignment, savedCar, null, null);

                    return carAssignmentRepositoryPort.save(carAssignmentToProcess).then();
                });
    }

    private Mono<Void> validateMemberExists(Long memberId) {
        return Mono.justOrEmpty(memberId)
                .flatMap(id -> memberRepositoryPort.existsById(id)
                        .filter(Boolean::booleanValue)
                        .switchIfEmpty(Mono.error(new EntityNotFoundException("Member not found with id: " + id)))
                        .then()
                )
                .then();
    }

    private Mono<Void> createInitialPaymentSchedules(
            UUID carAssignmentId,
            CarAssignment carAssignment,
            CarRankBonus rankBonus
    ) {
        List<CarPaymentSchedule> schedules = carPaymentScheduleFactory
                .createInitialSchedules(carAssignmentId, carAssignment, rankBonus);
        return carPaymentScheduleRepositoryPort.saveAll(schedules)
                .then();
    }

    private Mono<String> saveImage(FileResource fileResource) {
        if (fileResource == null) return Mono.just("");
        return fileStoragePort.save(fileResource, FileContext.CAR_IMAGE);
    }

    private Mono<Classification> getClassificationByQuotationId(UUID quotationId) {
        return carQuotationRepositoryPort.findById(quotationId)
                .switchIfEmpty(Mono.error(new EntityNotFoundException("Quotation not found with the provided ID.")))
                .doOnNext(carAssignmentValidator::validateQuotation)
                .flatMap(quotation -> classificationRepositoryPort.findById(quotation.classificationId())
                        .switchIfEmpty(Mono.error(new EntityNotFoundException(
                                "Classification not found for the provided quotation.")))
                );
    }

    private Mono<CarRankBonus> getRankBonus(Classification classification) {
        if (classification == null || classification.rankId() == null) {
            return Mono.error(new EntityNotFoundException("Classification not found for the provided quotation."));
        }
        return carRankBonusRepositoryPort
                .findByRankIdAndStatusId(classification.rankId(), CarRankBonusStatus.ACTIVE.getId())
                .switchIfEmpty(Mono.error(new EntityNotFoundException(
                        "We do not have an active rank bonus for your current rank.")));
    }

}
