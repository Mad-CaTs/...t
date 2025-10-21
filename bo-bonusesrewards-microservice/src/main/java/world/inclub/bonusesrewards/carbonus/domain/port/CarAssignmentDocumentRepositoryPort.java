package world.inclub.bonusesrewards.carbonus.domain.port;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.CarAssignmentDocument;

import java.util.UUID;

public interface CarAssignmentDocumentRepositoryPort {

    Mono<CarAssignmentDocument> save(CarAssignmentDocument document);

    Mono<CarAssignmentDocument> findById(UUID id);

    Mono<Void> deleteById(UUID id);
}