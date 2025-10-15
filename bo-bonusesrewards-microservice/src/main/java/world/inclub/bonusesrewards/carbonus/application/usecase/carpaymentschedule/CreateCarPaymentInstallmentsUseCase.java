package world.inclub.bonusesrewards.carbonus.application.usecase.carpaymentschedule;

import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.carbonus.domain.model.CarPaymentSchedule;

import java.math.BigDecimal;
import java.util.UUID;

public interface CreateCarPaymentInstallmentsUseCase {

    /**
     * Creates multiple car payment installments for a specific car assignment.
     *
     * @param carAssignmentId          the unique identifier of the car assignment
     * @param gpsAmount                the amount for GPS service
     * @param insuranceAmount          the amount for insurance
     * @param mandatoryInsuranceAmount the amount for mandatory insurance
     * @return a Flux emitting the created CarPaymentSchedule objects
     */
    Flux<CarPaymentSchedule> createInstallments(
            UUID carAssignmentId,
            BigDecimal gpsAmount,
            BigDecimal insuranceAmount,
            BigDecimal mandatoryInsuranceAmount
    );

}
