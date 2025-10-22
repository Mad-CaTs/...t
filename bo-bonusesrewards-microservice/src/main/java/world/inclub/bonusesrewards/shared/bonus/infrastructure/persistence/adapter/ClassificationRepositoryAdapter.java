package world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.bonus.domain.model.Classification;
import world.inclub.bonusesrewards.shared.bonus.domain.port.ClassificationRepositoryPort;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.mapper.ClassificationEntityMapper;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.repository.ClassificationR2dbcRepository;

import java.util.Collection;
import java.util.UUID;

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

    @Override
    public Flux<Classification> findByMemberIdAndRankIds(Long memberId, Collection<Long> rankId) {
        return classificationR2dbcRepository
                .findByMemberIdAndRankIdIn(memberId, rankId)
                .map(classificationEntityMapper::toDomain);
    }

    @Override
    public Mono<Classification> findById(UUID id) {
        return classificationR2dbcRepository.findById(id)
                .map(classificationEntityMapper::toDomain);
    }

    @Override
    public Mono<Classification> findByCarAssignmentId(UUID carAssignmentId) {
        return classificationR2dbcRepository.findByCarAssignmentId(carAssignmentId)
                .map(classificationEntityMapper::toDomain);
    }

}