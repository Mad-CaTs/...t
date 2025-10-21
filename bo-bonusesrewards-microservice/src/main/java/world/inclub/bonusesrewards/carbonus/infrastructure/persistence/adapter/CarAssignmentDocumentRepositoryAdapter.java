package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.CarAssignmentDocument;
import world.inclub.bonusesrewards.carbonus.domain.port.CarAssignmentDocumentRepositoryPort;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.mapper.CarAssignmentDocumentEntityMapper;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository.CarAssignmentDocumentR2dbcRepository;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class CarAssignmentDocumentRepositoryAdapter implements CarAssignmentDocumentRepositoryPort {

    private final CarAssignmentDocumentR2dbcRepository repository;
    private final CarAssignmentDocumentEntityMapper mapper;

    @Override
    public Mono<CarAssignmentDocument> save(CarAssignmentDocument document) {
        return repository.save(mapper.toEntity(document))
                .map(mapper::toDomain);
    }

    @Override
    public Mono<CarAssignmentDocument> findById(UUID id) {
        return repository.findById(id)
                .map(mapper::toDomain);
    }

    @Override
    public Mono<Void> deleteById(UUID id) {
        return repository.deleteById(id);
    }
}