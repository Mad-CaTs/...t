package world.inclub.bonusesrewards.carbonus.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.CarAssignmentDetail;
import world.inclub.bonusesrewards.carbonus.domain.criteria.CarAssignmentDetailSearchCriteria;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

import java.util.UUID;

/**
 * Port for accessing car assignment details with comprehensive information
 * including car, assignment, brand, and model details.
 */
public interface CarDetailsRepositoryPort {

    /**
     * Find a assignment by ID with complete details (car + assignment + brand/model)
     */
    Mono<CarAssignmentDetail> findByIdWithDetails(UUID id);

    /**
     * Search car assignments with complete details using various criteria with pagination
     *
     * @param criteria Search filters
     * @param pageable Pagination information using custom Pageable
     */
    Flux<CarAssignmentDetail> searchCarsWithDetails(CarAssignmentDetailSearchCriteria criteria, Pageable pageable);

    /**
     * Count car assignments matching the search criteria
     */
    Mono<Long> countCarsWithDetails(CarAssignmentDetailSearchCriteria criteria);
}