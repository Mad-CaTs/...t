package world.inclub.bonusesrewards.carbonus.application.scheduled;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.application.usecase.carpaymentschedule.ProcessInitialCarPaymentSchedulesUseCase;
import world.inclub.bonusesrewards.carbonus.application.usecase.carpaymentschedule.ProcessMonthlyCarPaymentSchedulesUseCase;

import java.util.function.Supplier;

@Slf4j
@Component
@RequiredArgsConstructor
public class CarPaymentAutoPaymentScheduler {

    private final ProcessInitialCarPaymentSchedulesUseCase initialUseCase;
    private final ProcessMonthlyCarPaymentSchedulesUseCase monthlyUseCase;

    /**
     * Scheduled task to process both initial and monthly car payment schedules automatically.
     * Runs every day at 5:00 AM.
     */
    @Scheduled(cron = "0 0 5 * * *", zone = "America/Lima")
    public void processAllAutoPayments() {
        runWithLog("INITIAL", initialUseCase::processInitials)
                .then(runWithLog("MONTHLY", monthlyUseCase::processMonthlies))
                .doOnSuccess(v -> log.info("[Scheduler] All auto-payment processing completed"))
                .subscribe();
    }

    private Mono<Void> runWithLog(String type, Supplier<Mono<Void>> supplier) {
        log.info("[Scheduler] Starting auto-payment processing for {} schedules", type);
        return supplier.get()
                .doOnSuccess(v -> log.info("[Scheduler] {} auto-payment processing completed", type))
                .doOnError(e -> log.error("[Scheduler] Error in {} auto-payment processing", type, e));
    }
}
