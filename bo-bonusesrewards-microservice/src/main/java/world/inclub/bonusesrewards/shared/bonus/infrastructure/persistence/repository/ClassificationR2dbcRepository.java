package world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.repository;

import org.springframework.data.r2dbc.repository.R2dbcRepository;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.entity.ClassificationEntity;

import java.util.UUID;

public interface ClassificationR2dbcRepository
        extends R2dbcRepository<ClassificationEntity, UUID> {}