package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository;

import org.springframework.data.r2dbc.repository.R2dbcRepository;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarEntity;

import java.util.UUID;

public interface CarR2dbcRepository
        extends R2dbcRepository<CarEntity, UUID> {}
