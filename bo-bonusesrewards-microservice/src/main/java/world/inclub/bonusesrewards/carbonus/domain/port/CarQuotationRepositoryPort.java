package world.inclub.bonusesrewards.carbonus.domain.port;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.CarQuotation;

import java.util.UUID;

public interface CarQuotationRepositoryPort {

    Mono<CarQuotation> save(CarQuotation carQuotation);

    Mono<CarQuotation> findById(UUID id);

    Mono<Void> deleteById(UUID id);

    Mono<Long> countByClassificationId(UUID classificationId);
}
