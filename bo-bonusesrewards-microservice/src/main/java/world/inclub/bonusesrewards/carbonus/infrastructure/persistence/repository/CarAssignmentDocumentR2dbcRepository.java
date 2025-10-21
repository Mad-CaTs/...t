package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository;

import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarAssignmentDocumentEntity;

import java.util.UUID;

@Repository
public interface CarAssignmentDocumentR2dbcRepository
        extends R2dbcRepository<CarAssignmentDocumentEntity, UUID> {}