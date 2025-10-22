package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository;

import org.springframework.data.r2dbc.repository.R2dbcRepository;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarBonusApplicationEntity;

import java.util.UUID;

public interface CarBonusApplicationR2dbcRepository
        extends R2dbcRepository<CarBonusApplicationEntity, UUID> {
}
