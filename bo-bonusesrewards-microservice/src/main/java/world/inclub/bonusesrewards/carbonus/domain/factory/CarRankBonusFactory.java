package world.inclub.bonusesrewards.carbonus.domain.factory;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.model.CarRankBonus;
import world.inclub.bonusesrewards.carbonus.domain.model.CarRankBonusStatus;
import world.inclub.bonusesrewards.shared.infrastructure.context.TimezoneContext;

import java.time.Instant;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.UUID;

@Component
public class CarRankBonusFactory {

    /**
     * Creates a new CarRankBonus with status set to ACTIVE and applying business rules for dates.
     * Business Rule: issueDate starts at 00:00:00, expirationDate ends at 23:59:59
     *
     * @param carRankBonus The CarRankBonus data to create.
     * @return A new CarRankBonus instance with status ACTIVE and adjusted dates.
     */
    public CarRankBonus create(CarRankBonus carRankBonus) {
        return CarRankBonus.builder()
                .rankId(carRankBonus.rankId())
                .monthlyBonus(carRankBonus.monthlyBonus())
                .initialBonus(carRankBonus.initialBonus())
                .bonusPrice(carRankBonus.bonusPrice())
                .issueDate(adjustIssueDate(carRankBonus.issueDate()))
                .expirationDate(adjustExpirationDate(carRankBonus.expirationDate()))
                .statusId(CarRankBonusStatus.ACTIVE.getId())
                .build();
    }

    /**
     * Updates the status to SUPERSEDED when the bonus is being used in a schedule. The record remains, but the bonus
     * cannot be reassigned. Existing assignments are still valid.
     *
     * @param carRankBonus The bonus to update.
     * @return The updated CarRankBonus.
     */
    public CarRankBonus updateToSuperseded(CarRankBonus carRankBonus) {
        return carRankBonus.toBuilder()
                .statusId(CarRankBonusStatus.SUPERSEDED.getId())
                .build();
    }

    /**
     * Updates the status to EXPIRED when the bonus has reached its expiration date. The record remains, but the bonus
     * cannot be reassigned. Existing assignments are still valid.
     *
     * @param carRankBonus The bonus to update.
     * @return The updated CarRankBonus.
     */
    public CarRankBonus updateToExpired(CarRankBonus carRankBonus) {
        return carRankBonus.toBuilder()
                .statusId(CarRankBonusStatus.EXPIRED.getId())
                .build();
    }

    /**
     * Creates a new CarRankBonus using the old id and new data.
     * All fields except id are updated from the newCarRankBonus.
     * The status is set to ACTIVE. The record is only updated if it has not been used in any schedule.
     * Business Rule: issueDate starts at 00:00:00, expirationDate ends at 23:59:59
     *
     * @param oldCarRankBonus The existing CarRankBonus to update.
     * @param newCarRankBonus The new data for CarRankBonus.
     * @return A new CarRankBonus instance with updated fields and adjusted dates.
     */
    public CarRankBonus update(CarRankBonus oldCarRankBonus, CarRankBonus newCarRankBonus) {
        return CarRankBonus.builder()
                .id(oldCarRankBonus.id())
                .rankId(newCarRankBonus.rankId())
                .monthlyBonus(newCarRankBonus.monthlyBonus())
                .initialBonus(newCarRankBonus.initialBonus())
                .bonusPrice(newCarRankBonus.bonusPrice())
                .issueDate(adjustIssueDate(newCarRankBonus.issueDate()))
                .expirationDate(adjustExpirationDate(newCarRankBonus.expirationDate()))
                .statusId(CarRankBonusStatus.ACTIVE.getId())
                .build();
    }

    /**
     * Applies business rule: issueDate starts at beginning of day (00:00:00)
     */
    private Instant adjustIssueDate(Instant issueDate) {
        ZoneId userZone = TimezoneContext.getTimezone();
        return issueDate
                .atZone(userZone)
                .toLocalDate()
                .atStartOfDay(userZone)
                .toInstant();
    }

    /**
     * Applies business rule: expirationDate ends at end of day (23:59:59)
     */
    private Instant adjustExpirationDate(Instant expirationDate) {
        ZoneId userZone = TimezoneContext.getTimezone();
        return expirationDate
                .atZone(userZone)
                .toLocalDate()
                .atTime(LocalTime.of(23, 59, 59))
                .atZone(userZone)
                .toInstant();
    }

    /**
     * Updates the status to CANCELLED when the bonus is deleted but used in schedules.
     * The record remains, but the bonus cannot be reassigned.
     */
    public CarRankBonus updateToCancelled(CarRankBonus carRankBonus) {
        return carRankBonus.toBuilder()
                .statusId(CarRankBonusStatus.CANCELLED.getId())
                .build();
    }
}