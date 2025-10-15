package world.inclub.bonusesrewards.carbonus.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.application.usecase.carassignment.*;
import world.inclub.bonusesrewards.carbonus.domain.factory.CarAssignmentFactory;
import world.inclub.bonusesrewards.carbonus.domain.factory.CarFactory;
import world.inclub.bonusesrewards.carbonus.domain.factory.CarPaymentScheduleFactory;
import world.inclub.bonusesrewards.carbonus.domain.model.*;
import world.inclub.bonusesrewards.carbonus.domain.port.CarAssignmentRepositoryPort;
import world.inclub.bonusesrewards.carbonus.domain.port.CarPaymentScheduleRepositoryPort;
import world.inclub.bonusesrewards.carbonus.domain.port.CarRankBonusRepositoryPort;
import world.inclub.bonusesrewards.carbonus.domain.port.CarRepositoryPort;
import world.inclub.bonusesrewards.carbonus.domain.validator.CarAssigmentValidator;
import world.inclub.bonusesrewards.shared.utils.filestorage.domain.model.FileContext;
import world.inclub.bonusesrewards.shared.utils.filestorage.domain.model.FileResource;
import world.inclub.bonusesrewards.shared.utils.filestorage.domain.port.FileStoragePort;
import world.inclub.bonusesrewards.shared.exceptions.EntityNotFoundException;
import world.inclub.bonusesrewards.shared.logging.LoggerService;
import world.inclub.bonusesrewards.shared.member.domain.port.MemberRepositoryPort;
import world.inclub.bonusesrewards.shared.rank.domain.port.MemberRankDetailRepositoryPort;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CarAssigmentService
        implements SaveCarAssigmentUseCase,
                   UpdateCarAssigmentUseCase,
                   DeleteCarAssigmentByIdUseCase {

    private final CarRepositoryPort carRepositoryPort;
    private final CarAssignmentRepositoryPort carAssignmentRepositoryPort;
    private final MemberRepositoryPort memberRepositoryPort;
    private final CarPaymentScheduleRepositoryPort carPaymentScheduleRepositoryPort;
    private final MemberRankDetailRepositoryPort memberRankDetailRepositoryPort;
    private final CarRankBonusRepositoryPort carRankBonusRepositoryPort;
    private final FileStoragePort fileStoragePort;
    private final CarAssigmentValidator carAssigmentValidator;
    private final CarFactory carFactory;
    private final CarAssignmentFactory carAssignmentFactory;
    private final CarPaymentScheduleFactory carPaymentScheduleFactory;

    private final LoggerService logger;

    @Override
    public Mono<Void> saveCarAssignment(
            Car car,
            CarAssignment carAssignment,
            FileResource fileResource
    ) {
        carAssigmentValidator.validatePaymentDay(carAssignment);
        return validateMemberExists(carAssignment.memberId())
                .then(saveImage(fileResource))
                .flatMap(imageUrl -> carAssignment.memberId() != null
                        ? processCarAssignmentWithMember
                        (car, carAssignment, imageUrl, null, null, false)
                        : processCarAssignmentWithoutMember
                        (car, carAssignment, imageUrl, null, null, false)
                );
    }

    @Override
    public Mono<Void> updateCarAssigment(
            UUID carAssignmentId,
            Car car,
            CarAssignment carAssignment,
            FileResource fileResource
    ) {
        return carAssignmentRepositoryPort.findById(carAssignmentId)
                .switchIfEmpty(Mono.error(new EntityNotFoundException("Assignment not found with id: " + carAssignmentId)))
                .doOnNext(carAssigmentValidator::validateCanBeUpdated)
                .flatMap(existingAssignment -> carRepositoryPort.findById(existingAssignment.carId())
                        .switchIfEmpty(Mono.error(new EntityNotFoundException("Car not found with id: " + existingAssignment.carId())))
                        .flatMap(existingCar -> validateMemberExists(carAssignment.memberId())
                                .then(saveImage(fileResource))
                                .flatMap(imageUrl -> carAssignment.memberId() != null
                                        ? processCarAssignmentWithMember
                                        (car, carAssignment, imageUrl, existingCar, existingAssignment, true)
                                        : processCarAssignmentWithoutMember
                                        (car, carAssignment, imageUrl, existingCar, existingAssignment, true)
                                )
                        )
                );
    }

    @Override
    public Mono<Void> deleteById(UUID carAssignmentId) {
        return carAssignmentRepositoryPort.findById(carAssignmentId)
                .switchIfEmpty(Mono.error(new EntityNotFoundException("Car assignment not found with id: " + carAssignmentId)))
                .doOnNext(carAssigmentValidator::validateCanBeDeleted)
                .flatMap(carAssignment ->
                                 carAssignmentRepositoryPort.deleteById(carAssignmentId)
                                         .then(carRepositoryPort.deleteById(carAssignment.carId()))
                );
    }

    private Mono<Void> processCarAssignmentWithMember(
            Car car,
            CarAssignment carAssignment,
            String imageUrl,
            Car existingCar,
            CarAssignment existingAssignment,
            boolean isUpdate
    ) {
        return getRankBonus(carAssignment.memberId())
                .flatMap(rankBonus -> {
                    Car carToProcess = isUpdate
                            ? carFactory.updateCar(car, existingCar, imageUrl)
                            : carFactory.createCar(car, imageUrl);

                    return carRepositoryPort.save(carToProcess)
                            .flatMap(savedCar -> {
                                CarAssignment carAssignmentToProcess = isUpdate
                                        ? carAssignmentFactory.prepareForUpdate(carAssignment,
                                                                                existingAssignment,
                                                                                rankBonus)
                                        : carAssignmentFactory.prepareForSave(carAssignment, savedCar, rankBonus);

                                return carAssignmentRepositoryPort.save(carAssignmentToProcess)
                                        .flatMap(savedAssignment ->
                                                         createInitialPaymentSchedules(savedAssignment.id(),
                                                                                       savedAssignment,
                                                                                       rankBonus));
                            });
                });
    }

    private Mono<Void> processCarAssignmentWithoutMember(
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
                            ? carAssignmentFactory.prepareForUpdate(carAssignment, existingAssignment, null)
                            : carAssignmentFactory.prepareForSave(carAssignment, savedCar, null);

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

    private Mono<CarRankBonus> getRankBonus(Long memberId) {
        if (memberId == null) return Mono.empty();

        return memberRankDetailRepositoryPort.findByMemberId(memberId)
                .switchIfEmpty(Mono.error(new EntityNotFoundException("Rank detail not found for memberId: " + memberId)))
                .flatMap(rankDetail -> carRankBonusRepositoryPort
                        .findByRankIdAndStatusId(rankDetail.rankId(), CarRankBonusStatus.ACTIVE.getId())
                        .switchIfEmpty(Mono.error(new EntityNotFoundException(
                                "We do not have an active rank bonus for your current rank."))));
    }

}
