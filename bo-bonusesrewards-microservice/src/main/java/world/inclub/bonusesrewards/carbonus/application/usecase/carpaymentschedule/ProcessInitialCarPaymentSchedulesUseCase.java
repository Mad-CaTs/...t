package world.inclub.bonusesrewards.carbonus.application.usecase.carpaymentschedule;

import reactor.core.publisher.Mono;

public interface ProcessInitialCarPaymentSchedulesUseCase {

    /**
     * Processes all pending or overdue initial car payment schedules.
     * Should trigger payment logic (wallet deduction or log) and update schedule status/date.
     */
    Mono<Void> processInitials();

}
