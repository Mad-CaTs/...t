package world.inclub.bonusesrewards.shared.bonus.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.bonus.domain.model.Prequalification;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

import java.util.List;

public interface CompoundPeriodRepositoryPort {

    /**
     * Finds top users by requalifications based on historical compound periods.
     * Uses MongoDB aggregation to calculate requalifications efficiently.
     *
     * @param periodMin           minimum period ID to consider
     * @param periodMax           maximum period ID to consider
     * @param rankId              specific rank ID to filter
     * @param minRequalifications minimum number of requalifications required
     * @return Flux of ALL requalification results ordered by total direct points DESC (no limit)
     */
    Flux<Prequalification> findTopRequalifications(
            Long periodMin,
            Long periodMax,
            Long rankId,
            Long minRequalifications
    );

    /**
     * Finds top users by requalifications with pagination based on historical compound periods.
     * Uses MongoDB aggregation to calculate requalifications efficiently with pagination support.
     *
     * @param periodMin           minimum period ID to consider
     * @param periodMax           maximum period ID to consider
     * @param rankId              specific rank ID to filter
     * @param minRequalifications minimum number of requalifications required
     * @param pageable            pagination settings
     * @return Flux of paginated requalification results ordered by total direct points DESC
     */
    Flux<Prequalification> findTopRequalificationsPaginated(
            Long periodMin,
            Long periodMax,
            Long rankId,
            Long minRequalifications,
            Pageable pageable
    );

    /**
     * Counts the total number of prequalifications matching the criteria.
     *
     * @param periodMin           minimum period ID to consider
     * @param periodMax           maximum period ID to consider
     * @param rankId              specific rank ID to filter
     * @param minRequalifications minimum number of requalifications required
     * @return Mono with the total count
     */
    Mono<Long> countPrequalifications(
            Long periodMin,
            Long periodMax,
            Long rankId,
            Long minRequalifications
    );

    /**
     * Finds requalifications for specific member IDs.
     *
     * @param memberIds           list of member IDs to filter
     * @param periodMin           minimum period ID to consider
     * @param periodMax           maximum period ID to consider
     * @param rankId              specific rank ID to filter
     * @param minRequalifications minimum number of requalifications required
     * @return Flux of requalification results for the member IDs
     */
    Flux<Prequalification> findByMemberIds(
            List<Long> memberIds,
            Long periodMin,
            Long periodMax,
            Long rankId,
            Long minRequalifications
    );

    /**
     * Finds requalifications for a specific member ID and a list of rank IDs.
     *
     * @param memberId specific member ID to filter
     * @param rankIds  list of rank IDs to filter
     * @return Flux of requalification results for the member ID and rank IDs
     */
    Flux<Prequalification> findByMemberIdAndRankIds(
            Long memberId,
            List<Long> rankIds
    );

}