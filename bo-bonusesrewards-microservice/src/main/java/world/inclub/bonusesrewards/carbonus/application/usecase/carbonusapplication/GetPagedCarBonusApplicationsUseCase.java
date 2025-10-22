package world.inclub.bonusesrewards.carbonus.application.usecase.carbonusapplication;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarBonusApplicationDetail;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PagedData;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

import java.math.BigDecimal;
import java.time.Instant;

public interface GetPagedCarBonusApplicationsUseCase {

    /**
     * Get all car bonus application details with optional filters and pagination.
     *
     * @param member      Optional member identifier to filter by.
     * @param appliedDate Optional date to filter applications by their applied date.
     * @param bonusAmount Optional bonus amount to filter applications.
     * @param onlyInitial Optional flag to filter only initial applications.
     * @param pageable    Pagination information.
     * @return A Mono emitting paged data of car bonus application details.
     */
    Mono<PagedData<CarBonusApplicationDetail>> getBonusApplicationDetails(
            String member,
            Instant appliedDate,
            BigDecimal bonusAmount,
            Boolean onlyInitial,
            Pageable pageable
    );

}