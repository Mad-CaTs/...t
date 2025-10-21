package world.inclub.bonusesrewards.carbonus.domain.validator;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.model.CarAssignment;
import world.inclub.bonusesrewards.carbonus.domain.model.CarQuotation;
import world.inclub.bonusesrewards.shared.exceptions.BusinessRuleException;
import world.inclub.bonusesrewards.shared.exceptions.EntityNotFoundException;

@Component
public class CarAssignmentValidator {

    private void validateUnassigned(CarAssignment carAssignment) {
        if (carAssignment == null) {
            throw new EntityNotFoundException("Car cannot be null");
        }
        if (carAssignment.isAssigned()) {
            throw new BusinessRuleException("Only unassigned cars can be modified or deleted");
        }
        if (carAssignment.memberId() != null) {
            throw new BusinessRuleException("Car is already assigned to a member");
        }
    }

    public void validateCanBeUpdated(CarAssignment carAssignment) {
        validatePaymentDay(carAssignment);
        validateUnassigned(carAssignment);
    }

    public void validateCanBeDeleted(CarAssignment carAssignment) {
        validateUnassigned(carAssignment);
    }

    public void validatePaymentDay(CarAssignment carAssignment) {
        if (carAssignment == null || carAssignment.paymentStartDate() == null) {
            throw new BusinessRuleException("CarAssignment and paymentStartDate cannot be null");
        }
        
        int dia = carAssignment.paymentStartDate().getDayOfMonth();
        if (dia < 1 || dia > 31) {
            throw new BusinessRuleException("Payment start day must be between 1 and 31");
        }
    }

    public void validateQuotation(CarQuotation carQuotation) {
        if (carQuotation == null) {
            throw new EntityNotFoundException("Quotation cannot be null");
        }
        if (!carQuotation.isAccepted()) {
            throw new BusinessRuleException("Quotation must be accepted to assign a car");
        }
    }

}