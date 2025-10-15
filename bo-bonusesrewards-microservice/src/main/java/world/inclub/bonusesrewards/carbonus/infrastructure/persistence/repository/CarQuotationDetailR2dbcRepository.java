package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository;

import org.springframework.data.r2dbc.repository.R2dbcRepository;
import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarQuotationDetailViewEntity;

import java.util.UUID;

public interface CarQuotationDetailR2dbcRepository
        extends R2dbcRepository<CarQuotationDetailViewEntity, UUID> {
    Flux<CarQuotationDetailViewEntity> findByClassificationId(UUID classificationId);
}
