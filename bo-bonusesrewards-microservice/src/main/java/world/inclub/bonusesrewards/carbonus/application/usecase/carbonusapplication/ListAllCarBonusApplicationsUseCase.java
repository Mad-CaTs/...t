package world.inclub.bonusesrewards.carbonus.application.usecase.carbonusapplication;

import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarBonusApplicationDetail;

import java.math.BigDecimal;
import java.time.Instant;

public interface ListAllCarBonusApplicationsUseCase {

    /**
     * Retrieves a list of car bonus application details based on the provided filters.
     *
     * @param member      The member identifier to filter by.
     * @param appliedDate The date the bonus was applied to filter by.
     * @param bonusAmount The bonus amount to filter by.
     * @param onlyInitial Flag to indicate if only initial bonuses should be included.
     * @return A Flux stream of CarBonusApplicationDetail matching the filters.
     */
    Flux<CarBonusApplicationDetail> getBonusApplicationDetails(
            String member,
            Instant appliedDate,
            BigDecimal bonusAmount,
            Boolean onlyInitial
    );

}
