package world.inclub.bonusesrewards.carbonus.domain.port;

import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarQuotationDetail;

import java.util.UUID;

public interface CarQuotationDetailRepositoryPort {
    Flux<CarQuotationDetail> findByClassificationId(UUID classificationId);
}
