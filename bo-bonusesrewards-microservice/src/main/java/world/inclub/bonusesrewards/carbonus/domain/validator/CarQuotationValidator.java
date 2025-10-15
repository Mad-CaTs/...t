package world.inclub.bonusesrewards.carbonus.domain.validator;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.exceptions.BusinessRuleException;

@Component
public class CarQuotationValidator {

    public void validateQuotationCreation(Long count) {
        if (count >= 2) {
            throw new BusinessRuleException(
                    "Cannot create more than 2 quotations for the same classification. Current count: " + count);
        }
    }

    public void ensureQuotationCanBeUpdated(Long acceptedCount) {
        ensureNoOtherQuotationAccepted(acceptedCount);
    }

    public void ensureQuotationCanBeDeleted(Long acceptedCount) {
        ensureNoOtherQuotationAccepted(acceptedCount);
    }

    public void ensureQuotationCanBeAccepted(Long acceptedCount) {
        ensureNoOtherQuotationAccepted(acceptedCount);
    }

    private void ensureNoOtherQuotationAccepted(Long acceptedCount) {
        if (acceptedCount > 0) {
            throw new BusinessRuleException(
                    "Cannot perform this action because another quotation for this classification is already accepted."
            );
        }
    }

}
