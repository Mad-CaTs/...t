package world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.bonus.domain.model.Classification;
import world.inclub.bonusesrewards.shared.bonus.domain.port.ClassificationRepositoryPort;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.mapper.ClassificationEntityMapper;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.repository.ClassificationR2dbcRepository;

@Repository
@RequiredArgsConstructor
public class ClassificationRepositoryAdapter
        implements ClassificationRepositoryPort {

    private final ClassificationR2dbcRepository classificationR2dbcRepository;
    private final ClassificationEntityMapper classificationEntityMapper;

    @Override
    public Mono<Classification> save(Classification classification) {
        return classificationR2dbcRepository
                .save(classificationEntityMapper.toEntity(classification))
                .map(classificationEntityMapper::toDomain);
    }
    
}