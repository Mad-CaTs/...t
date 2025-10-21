package world.inclub.bonusesrewards.carbonus.domain.port;

import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarAssignmentDocumentDetail;

import java.util.UUID;

public interface CarAssignmentDocumentDetailRepositoryPort {
    Flux<CarAssignmentDocumentDetail> findByCarAssignmentId(UUID carAssignmentId);
}