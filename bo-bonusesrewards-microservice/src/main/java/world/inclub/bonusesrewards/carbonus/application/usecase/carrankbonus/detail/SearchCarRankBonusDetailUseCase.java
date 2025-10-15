package world.inclub.bonusesrewards.carbonus.application.usecase.carrankbonus.detail;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.criteria.CarRankBonusDetailSearchCriteria;
import world.inclub.bonusesrewards.carbonus.domain.model.CarRankBonusDetail;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PagedData;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

public interface SearchCarRankBonusDetailUseCase {

    /**
     * Searches for CarRankBonusDetail details based on the provided criteria and pagination information.
     *
     * @param criteria the search criteria
     * @param pageable the pagination information
     * @return a Mono emitting a PagedData object containing the search results
     */
    Mono<PagedData<CarRankBonusDetail>> searchCarRankBonusDetails(
            CarRankBonusDetailSearchCriteria criteria,
            Pageable pageable
    );

}
