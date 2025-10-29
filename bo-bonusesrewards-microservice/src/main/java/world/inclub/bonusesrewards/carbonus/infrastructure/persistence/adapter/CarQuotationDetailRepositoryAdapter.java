package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarQuotationDetail;
import world.inclub.bonusesrewards.carbonus.domain.port.CarQuotationDetailRepositoryPort;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarQuotationDetailViewEntity;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.mapper.CarQuotationDetailViewEntityMapper;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository.CarQuotationDetailR2dbcRepository;
import world.inclub.bonusesrewards.shared.event.domain.model.Event;
import world.inclub.bonusesrewards.shared.event.domain.port.EventRepositoryPort;
import world.inclub.bonusesrewards.shared.exceptions.EntityNotFoundException;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class CarQuotationDetailRepositoryAdapter
        implements CarQuotationDetailRepositoryPort {

    private final CarQuotationDetailR2dbcRepository carQuotationDetailR2dbcRepository;
    private final EventRepositoryPort eventRepositoryPort;
    private final CarQuotationDetailViewEntityMapper carQuotationDetailViewEntityMapper;

    @Override
    public Flux<CarQuotationDetail> findByClassificationId(UUID classificationId) {
        return carQuotationDetailR2dbcRepository.findByClassificationId(classificationId)
                .switchIfEmpty(Flux.error(new EntityNotFoundException(
                        "Quotation details not found for classification id: " + classificationId)))
                .collectList()
                .flatMapMany(carQuotationDetailEntities -> {
                    Set<Long> eventIds = carQuotationDetailEntities.stream()
                            .map(CarQuotationDetailViewEntity::getEventId)
                            .collect(Collectors.toSet());

                    return eventRepositoryPort.findByIdIn(eventIds)
                            .collectMap(Event::id)
                            .flatMapMany(eventMap -> Flux.fromIterable(carQuotationDetailEntities)
                                    .map(entity -> {
                                        // If event is not found, we pass null
                                        Event event = eventMap.getOrDefault(entity.getEventId(), null);
                                        return carQuotationDetailViewEntityMapper.toDomain(entity, event);
                                    })
                            );
                });
    }
}
