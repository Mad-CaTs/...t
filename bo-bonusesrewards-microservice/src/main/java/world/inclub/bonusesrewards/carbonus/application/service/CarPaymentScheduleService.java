package world.inclub.bonusesrewards.carbonus.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.application.usecase.carpaymentschedule.CreateCarPaymentInstallmentsUseCase;
import world.inclub.bonusesrewards.carbonus.domain.factory.CarPaymentScheduleFactory;
import world.inclub.bonusesrewards.carbonus.domain.model.CarPaymentSchedule;
import world.inclub.bonusesrewards.carbonus.domain.port.CarAssignmentRepositoryPort;
import world.inclub.bonusesrewards.carbonus.domain.port.CarPaymentScheduleRepositoryPort;
import world.inclub.bonusesrewards.carbonus.domain.port.CarRankBonusRepositoryPort;
import world.inclub.bonusesrewards.carbonus.domain.validator.CarPaymentScheduleValidator;
import world.inclub.bonusesrewards.shared.exceptions.EntityNotFoundException;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CarPaymentScheduleService
        implements CreateCarPaymentInstallmentsUseCase {

    private final CarAssignmentRepositoryPort carAssignmentRepositoryPort;
    private final CarRankBonusRepositoryPort carRankBonusRepositoryPort;
    private final CarPaymentScheduleRepositoryPort carPaymentScheduleRepositoryPort;
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
                                ))))
                .flatMapMany(carPaymentScheduleRepositoryPort::saveAll);
    }
}