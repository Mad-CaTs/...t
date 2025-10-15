package world.inclub.bonusesrewards.carbonus.domain.validator;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.model.CarRankBonus;
import world.inclub.bonusesrewards.carbonus.domain.model.CarRankBonusStatus;
import world.inclub.bonusesrewards.shared.exceptions.BusinessRuleException;
import world.inclub.bonusesrewards.shared.exceptions.EntityNotFoundException;
import world.inclub.bonusesrewards.shared.exceptions.RequiredFieldException;

import java.math.BigDecimal;

@Component
public class CarRankBonusValidator {

    public void validateCanBeUpdated(CarRankBonus bonus) {
        validateBonusExists(bonus);
        validateIsActive(bonus);
    }

    public void validateCanBeDeleted(CarRankBonus bonus) {
        validateBonusExists(bonus);
        validateIsActive(bonus);
    }

    public void validateCanBeCreated(CarRankBonus bonus) {
        validateBonusExists(bonus);
        validateRequiredFields(bonus);
        validatePositiveAmounts(bonus);
        validateDates(bonus);
    }

    public boolean isActive(CarRankBonus bonus) {
        return bonus != null && bonus.statusId().equals(CarRankBonusStatus.ACTIVE.getId());
    }

    public boolean isInactive(CarRankBonus bonus) {
        return bonus != null && 
               (bonus.statusId().equals(CarRankBonusStatus.EXPIRED.getId()) ||
                bonus.statusId().equals(CarRankBonusStatus.SUPERSEDED.getId()));
    }

    private void validateBonusExists(CarRankBonus bonus) {
        if (bonus == null) {
            throw new EntityNotFoundException("CarRankBonus cannot be null");
        }
    }

    private void validateIsActive(CarRankBonus bonus) {
        if (!isActive(bonus)) {
            throw new BusinessRuleException("Only active bonuses can be modified or deleted");
        }
    }

    private void validateRequiredFields(CarRankBonus bonus) {
        if (bonus.rankId() == null) {
            throw new RequiredFieldException("Rank ID is required");
        }

        if (bonus.monthlyBonus() == null) {
            throw new RequiredFieldException("Monthly bonus is required");
        }
        
        if (bonus.initialBonus() == null) {
            throw new RequiredFieldException("Initial bonus is required");
        }
        
        if (bonus.bonusPrice() == null) {
            throw new RequiredFieldException("Bonus price is required");
        }
    }

    private void validatePositiveAmounts(CarRankBonus bonus) {
        if (bonus.monthlyBonus() == null || bonus.monthlyBonus().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessRuleException("Monthly bonus must be greater than zero");
        }

        if (bonus.initialBonus() == null || bonus.initialBonus().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessRuleException("Initial bonus must be greater than zero");
        }
        
        if (bonus.bonusPrice() == null || bonus.bonusPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessRuleException("Bonus price must be greater than zero");
        }
    }

    private void validateDates(CarRankBonus bonus) {
        if (bonus.issueDate() == null) {
            throw new RequiredFieldException("Issue date is required");
        }
        
        if (bonus.expirationDate() == null) {
            throw new RequiredFieldException("Expiration date is required");
        }
        
        if (bonus.expirationDate().isBefore(bonus.issueDate())) {
            throw new BusinessRuleException("Expiration date cannot be before issue date");
        }
    }

    /**
     * Validates that there is no active bonus for the same rank.
     * This is a business rule: only one active bonus is allowed per rank.
     */
    public void validateUniqueActiveRank(CarRankBonus bonus, boolean activeRankExists) {
        if (activeRankExists) {
            throw new BusinessRuleException("An active CarRankBonus already exists for rank: " + bonus.rankId());
        }
    }
}