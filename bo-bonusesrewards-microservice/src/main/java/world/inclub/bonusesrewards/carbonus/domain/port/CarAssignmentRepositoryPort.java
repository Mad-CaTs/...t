package world.inclub.bonusesrewards.carbonus.domain.port;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.CarAssignment;

import java.util.UUID;

public interface CarAssignmentRepositoryPort {

    Mono<CarAssignment> save(CarAssignment carAssignment);

    Mono<CarAssignment> findById(UUID id);

    Mono<Void> deleteById(UUID id);

    Mono<Boolean> existsByRankBonusId(UUID rankBonusId);

}
