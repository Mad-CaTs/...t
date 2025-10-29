package world.inclub.bonusesrewards.carbonus.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.application.usecase.carpaymentschedule.CreateCarPaymentInstallmentsUseCase;
import world.inclub.bonusesrewards.carbonus.application.usecase.carpaymentschedule.GetAllCarPaymentSchedulesUseCase;
import world.inclub.bonusesrewards.carbonus.application.usecase.carpaymentschedule.SearchCarPaymentScheduleInitialsUseCase;
import world.inclub.bonusesrewards.carbonus.application.usecase.carpaymentschedule.SearchCarPaymentSchedulesUseCase;
import world.inclub.bonusesrewards.carbonus.domain.factory.CarAssignmentFactory;
import world.inclub.bonusesrewards.carbonus.domain.factory.CarPaymentScheduleFactory;
import world.inclub.bonusesrewards.carbonus.domain.model.CarAssignment;
import world.inclub.bonusesrewards.carbonus.domain.model.CarPaymentSchedule;
import world.inclub.bonusesrewards.carbonus.domain.port.CarAssignmentRepositoryPort;
import world.inclub.bonusesrewards.carbonus.domain.port.CarPaymentScheduleRepositoryPort;
import world.inclub.bonusesrewards.carbonus.domain.port.CarRankBonusRepositoryPort;
import world.inclub.bonusesrewards.carbonus.domain.validator.CarPaymentScheduleValidator;
import world.inclub.bonusesrewards.shared.exceptions.EntityNotFoundException;
import world.inclub.bonusesrewards.shared.payment.domain.model.PaymentStatus;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PageDataBuilder;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PagedData;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CarPaymentScheduleService
        implements CreateCarPaymentInstallmentsUseCase,
                   GetAllCarPaymentSchedulesUseCase,
                   SearchCarPaymentScheduleInitialsUseCase,
                   SearchCarPaymentSchedulesUseCase {

    private final CarAssignmentRepositoryPort carAssignmentRepositoryPort;
    private final CarRankBonusRepositoryPort carRankBonusRepositoryPort;
    private final CarPaymentScheduleRepositoryPort carPaymentScheduleRepositoryPort;
    private final CarAssignmentFactory carAssignmentFactory;
    private final CarPaymentScheduleFactory carPaymentScheduleFactory;
    private final CarPaymentScheduleValidator carPaymentScheduleValidator;

    @Override
    public Flux<CarPaymentSchedule> createInstallments(
            UUID carAssignmentId,
            BigDecimal gpsAmount,
            BigDecimal insuranceAmount,
            BigDecimal mandatoryInsuranceAmount
    ) {
        return carAssignmentRepositoryPort.findById(carAssignmentId)
                .switchIfEmpty(Mono.error(new EntityNotFoundException("Assignment not found for the provided ID.")))
                .flatMap(carAssignment -> carPaymentScheduleRepositoryPort
                        .findLastByCarAssignmentId(carAssignmentId)
                        .switchIfEmpty(Mono.error
                                (new EntityNotFoundException
                                         ("This assignment does not have an initial payment schedule.")))
                        .doOnNext(carPaymentScheduleValidator::validateCanCreateInstallments)
                        .flatMap(last -> carRankBonusRepositoryPort.findById(carAssignment.rankBonusId())
                                .switchIfEmpty(Mono.error
                                        (new EntityNotFoundException("Not found rank bonus for the provided ID.")))
                                .map(rankBonus -> carPaymentScheduleFactory.createInstallmentSchedules(
                                        carAssignment,
                                        last,
                                        gpsAmount,
                                        insuranceAmount,
                                        mandatoryInsuranceAmount,
                                        rankBonus
                                ))
                                .zipWith(Mono.just(carAssignment))))
                .flatMapMany(tuple -> {
                    List<CarPaymentSchedule> schedules = tuple.getT1();
                    CarAssignment carAssignment = tuple.getT2();
                    CarAssignment updatedAssignment = carAssignmentFactory
                            .updateTotals(carAssignment, gpsAmount, insuranceAmount, mandatoryInsuranceAmount);
                    return carAssignmentRepositoryPort.save(updatedAssignment)
                            .thenMany(carPaymentScheduleRepositoryPort.saveAll(schedules));
                });
    }

    @Override
    public Flux<CarPaymentSchedule> findByCarAssignmentId(UUID carAssignmentId) {
        return carPaymentScheduleRepositoryPort
                .findByCarAssignmentId(carAssignmentId)
                .switchIfEmpty(Mono.error(new EntityNotFoundException(
                        "No schedules found for the provided car assignment ID.")));
    }

    @Override
    public Mono<PagedData<CarPaymentSchedule>> searchInitials(
            UUID carAssignmentId,
            Pageable pageable
    ) {
        Flux<CarPaymentSchedule> schedulesFlux = carPaymentScheduleRepositoryPort
                .findInitialsByCarAssignmentId(carAssignmentId, pageable)
                .switchIfEmpty(Mono.error(new EntityNotFoundException(
                        "No initial payment schedules found matching the criteria")));

        Mono<Long> countMono = carPaymentScheduleRepositoryPort
                .countInitialsByCarAssignmentId(carAssignmentId)
                .defaultIfEmpty(0L);

        return Mono.zip(schedulesFlux.collectList(), countMono)
                .map(tuple -> {
                    List<CarPaymentSchedule> schedules = tuple.getT1();
                    Long total = tuple.getT2();

                    return PageDataBuilder
                            .build(schedules, pageable, total);
                });
    }

    @Override
    public Mono<PagedData<CarPaymentSchedule>> searchCarPaymentSchedules(
            UUID carAssignmentId,
            Integer numberOfInstallments,
            String statusCode,
            Pageable pageable
    ) {
        Long statusId = statusCode != null
                ? PaymentStatus.fromName(statusCode).getId()
                : null;

        Flux<CarPaymentSchedule> schedulesFlux = carPaymentScheduleRepositoryPort
                .findAllByCarAssignmentIdWithPagination(carAssignmentId, numberOfInstallments, statusId, pageable)
                .switchIfEmpty(Mono.error(new EntityNotFoundException(
                        "No payment schedules found matching the criteria")));

        Mono<Long> countMono = carPaymentScheduleRepositoryPort
                .countByCarAssignmentId(carAssignmentId, numberOfInstallments, statusId)
                .defaultIfEmpty(0L);

        return Mono.zip(schedulesFlux.collectList(), countMono)
                .map(tuple -> {
                    List<CarPaymentSchedule> schedules = tuple.getT1();
                    Long total = tuple.getT2();

                    return PageDataBuilder
                            .build(schedules, pageable, total);
                });
    }
}