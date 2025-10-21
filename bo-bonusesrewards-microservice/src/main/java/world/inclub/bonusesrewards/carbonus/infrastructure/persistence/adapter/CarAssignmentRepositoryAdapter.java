package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarAssignmentWithClassification;
import world.inclub.bonusesrewards.carbonus.domain.model.CarAssignment;
import world.inclub.bonusesrewards.carbonus.domain.port.CarAssignmentRepositoryPort;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarAssignmentWithClassificationDTO;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.mapper.CarAssignmentEntityMapper;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository.CarAssignmentR2dbcRepository;

import java.util.Collection;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class CarAssignmentRepositoryAdapter
        implements CarAssignmentRepositoryPort {

    private final CarAssignmentR2dbcRepository carAssignmentR2dbcRepository;
    private final CarAssignmentEntityMapper carAssignmentEntityMapper;

    @Override
    public Mono<CarAssignment> save(CarAssignment carAssignment) {
        return carAssignmentR2dbcRepository
                .save(carAssignmentEntityMapper.toEntity(carAssignment))
                .map(carAssignmentEntityMapper::toDomain);
    }

    @Override
    public Mono<CarAssignment> findById(UUID id) {
        return carAssignmentR2dbcRepository.findById(id)
                .map(carAssignmentEntityMapper::toDomain);
    }

    @Override
    public Mono<Void> deleteById(UUID id) {
        return carAssignmentR2dbcRepository.deleteById(id);
    }

    @Override
    public Mono<Boolean> existsByRankBonusId(UUID rankBonusId) {
        return carAssignmentR2dbcRepository.existsByRankBonusId(rankBonusId);
    }

    @Override
    public Flux<CarAssignmentWithClassification> findByClassificationIds(Collection<UUID> classificationIds) {
        return carAssignmentR2dbcRepository.findByClassificationIdIn(classificationIds)
                .map(this::mapToDomain);
    }

    private CarAssignmentWithClassification mapToDomain(CarAssignmentWithClassificationDTO dto) {
        return new CarAssignmentWithClassification(
                dto.classificationId(),
                dto.carAssignmentId()
        );
    }


}