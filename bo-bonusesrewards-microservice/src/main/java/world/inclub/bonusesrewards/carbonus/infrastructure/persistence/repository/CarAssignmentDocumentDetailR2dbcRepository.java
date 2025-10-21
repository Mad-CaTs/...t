package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository;

import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarAssignmentDocumentDetailViewEntity;

import java.util.UUID;

@Repository
public interface CarAssignmentDocumentDetailR2dbcRepository
        extends R2dbcRepository<CarAssignmentDocumentDetailViewEntity, UUID> {
    Flux<CarAssignmentDocumentDetailViewEntity> findByCarAssignmentId(UUID carAssignmentId);
}