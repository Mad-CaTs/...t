package world.inclub.bonusesrewards.carbonus.application.usecase.carpaymentschedule;

import reactor.core.publisher.Mono;

public interface ProcessMonthlyCarPaymentSchedulesUseCase {

    /**
     * Processes all pending or overdue monthly car payment schedules.
     * Should trigger payment logic (wallet deduction or log) and update schedule status/date.
     */
    Mono<Void> processMonthlies();

}
