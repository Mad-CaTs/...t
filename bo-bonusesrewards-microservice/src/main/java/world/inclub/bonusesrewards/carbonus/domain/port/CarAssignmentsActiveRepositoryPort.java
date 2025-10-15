package world.inclub.bonusesrewards.carbonus.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.criteria.CarAssignmentsActiveSearchCriteria;
import world.inclub.bonusesrewards.carbonus.domain.model.CarAssignmentsActive;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

public interface CarAssignmentsActiveRepositoryPort {

    Flux<CarAssignmentsActive> findAll();

    Flux<CarAssignmentsActive> findAll(CarAssignmentsActiveSearchCriteria criteria, Pageable pageable);

    Mono<Long> countCarAssignmentsActive(CarAssignmentsActiveSearchCriteria criteria);

}