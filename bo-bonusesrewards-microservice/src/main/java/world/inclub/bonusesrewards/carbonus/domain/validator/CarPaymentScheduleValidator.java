package world.inclub.bonusesrewards.carbonus.domain.validator;

import org.springframework.stereotype.Service;
import world.inclub.bonusesrewards.carbonus.domain.model.CarPaymentSchedule;
import world.inclub.bonusesrewards.shared.exceptions.BusinessRuleException;

@Service
public class CarPaymentScheduleValidator {

    /**
     * Validates if installments can be created based on the last payment schedule.
     * Throws BusinessRuleException if installments have already been generated.
     */
    public void validateCanCreateInstallments(CarPaymentSchedule lastSchedule) {
        if (!Boolean.TRUE.equals(lastSchedule.isInitial())) {
            throw new BusinessRuleException("Installments already generated for this assignment.");
        }
    }

}
