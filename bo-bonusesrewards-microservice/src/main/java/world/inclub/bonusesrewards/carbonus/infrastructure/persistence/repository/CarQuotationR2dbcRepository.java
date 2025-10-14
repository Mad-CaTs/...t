package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository;

import org.springframework.data.r2dbc.repository.R2dbcRepository;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarQuotationEntity;

import java.util.UUID;

public interface CarQuotationR2dbcRepository
        extends R2dbcRepository<CarQuotationEntity, UUID> {

    Mono<Long> countByClassificationId(UUID classificationId);
}
