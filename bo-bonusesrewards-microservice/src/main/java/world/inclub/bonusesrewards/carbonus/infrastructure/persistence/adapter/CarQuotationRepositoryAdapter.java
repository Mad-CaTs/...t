package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.CarQuotation;

import world.inclub.bonusesrewards.carbonus.domain.port.CarQuotationRepositoryPort;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.mapper.CarQuotationMapper;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository.CarQuotationR2dbcRepository;

import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class CarQuotationRepositoryAdapter
        implements CarQuotationRepositoryPort {

    private final CarQuotationR2dbcRepository carQuotationR2DbcRepository;
    private final CarQuotationMapper carQuotationMapper;

    @Override
    public Mono<CarQuotation> save(CarQuotation carQuotation) {
        return carQuotationR2DbcRepository
                .save(carQuotationMapper.toEntity(carQuotation))
                .map(carQuotationMapper::toDomain);
    }

    @Override
    public Mono<CarQuotation> findById(UUID id) {
        return carQuotationR2DbcRepository
                .findById(id)
                .map(carQuotationMapper::toDomain);
    }

    @Override
    public Mono<Void> deleteById(UUID id) {
        return carQuotationR2DbcRepository
                .deleteById(id);
    }

    @Override
    public Mono<Long> countByClassificationId(UUID classificationId) {
        return carQuotationR2DbcRepository
                .countByClassificationId(classificationId);
    }

    @Override
    public Mono<Long> countAcceptedByClassificationId(UUID classificationId) {
        return carQuotationR2DbcRepository.countCarQuotationEntityByClassificationIdAndIsAcceptedIsTrue(classificationId);
    }

}
