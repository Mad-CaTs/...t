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

}
