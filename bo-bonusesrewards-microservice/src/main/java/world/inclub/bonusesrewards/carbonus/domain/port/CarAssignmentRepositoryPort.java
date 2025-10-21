package world.inclub.bonusesrewards.carbonus.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarAssignmentWithClassification;
import world.inclub.bonusesrewards.carbonus.domain.model.CarAssignment;

import java.util.Collection;
import java.util.UUID;

public interface CarAssignmentRepositoryPort {

    Mono<CarAssignment> save(CarAssignment carAssignment);

    Mono<CarAssignment> findById(UUID id);

    Mono<Void> deleteById(UUID id);

    Mono<Boolean> existsByRankBonusId(UUID rankBonusId);

    Flux<CarAssignmentWithClassification> findByClassificationIds(Collection<UUID> classificationIds);

}
