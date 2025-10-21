package world.inclub.bonusesrewards.carbonus.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.application.usecase.carpaymentschedule.ProcessInitialCarPaymentSchedulesUseCase;
import world.inclub.bonusesrewards.carbonus.application.usecase.carpaymentschedule.ProcessMonthlyCarPaymentSchedulesUseCase;
import world.inclub.bonusesrewards.carbonus.domain.factory.CarPaymentScheduleFactory;
import world.inclub.bonusesrewards.carbonus.domain.model.CarPaymentSchedule;
import world.inclub.bonusesrewards.carbonus.domain.port.CarPaymentScheduleRepositoryPort;
import world.inclub.bonusesrewards.shared.infrastructure.context.TimezoneContext;
import world.inclub.bonusesrewards.shared.logging.LoggerService;
import world.inclub.bonusesrewards.shared.payment.domain.model.BonusPaymentStatus;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.function.Supplier;

@Slf4j
@Service
@RequiredArgsConstructor
public class CarPaymentAutoPaymentService
        implements ProcessInitialCarPaymentSchedulesUseCase, ProcessMonthlyCarPaymentSchedulesUseCase {

    private final CarPaymentScheduleRepositoryPort carPaymentScheduleRepositoryPort;
    private final CarPaymentScheduleFactory carPaymentScheduleFactory;
    private final LoggerService loggerService;
    private static final int CONCURRENCY = 100;

    @Override
    public Mono<Void> processInitials() {
        return processPayments(() -> carPaymentScheduleRepositoryPort
                .findOverdueInitials
                        (BonusPaymentStatus.PENDING.getId(),
                         getTodayInUserTimezone()), "initial");
    }

    @Override
    public Mono<Void> processMonthlies() {
        return processPayments(() -> carPaymentScheduleRepositoryPort
                .findDueOrOverdueMonthlies
                        (BonusPaymentStatus.PENDING.getId(),
                         getTodayInUserTimezone()), "monthly");
    }

    private Mono<Void> processPayments(Supplier<Flux<CarPaymentSchedule>> supplier, String type) {
        return supplier.get()
                .switchIfEmpty(Mono.defer(() -> {
                    loggerService.info("No pending or overdue " + type + " car payment schedules found.");
                    return Mono.empty();
                }))
                .flatMap(schedule -> makePayment(schedule).then(updateScheduleToPaid(schedule)), CONCURRENCY)
                .onErrorContinue((throwable, schedule) -> {
                    loggerService.error("Error processing " + type
                                                + " payment schedule ID: " + ((CarPaymentSchedule) schedule).id()
                                                + ". Error: " + throwable.getMessage(), throwable);
                })
                .then();
    }

    private Mono<Void> makePayment(CarPaymentSchedule schedule) {
        loggerService.info("Simulating payment for schedule ID: " + schedule.id()); return Mono.empty();
    }

    private Mono<CarPaymentSchedule> updateScheduleToPaid(CarPaymentSchedule schedule) {
        CarPaymentSchedule updatedSchedule = carPaymentScheduleFactory.markAsPaid(schedule);
        return carPaymentScheduleRepositoryPort.save(updatedSchedule);
    }

    private LocalDate getTodayInUserTimezone() {
        ZoneId userZone = TimezoneContext.getTimezone();
        return LocalDate.now(userZone);
    }

}
