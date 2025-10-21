package world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.bonus.domain.model.BonusRequirement;
import world.inclub.bonusesrewards.shared.bonus.domain.port.BonusRequirementRepositoryPort;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.mapper.BonusRequirementEntityMapper;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.repository.BonusRequirementR2dbcRepository;

import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class BonusRequirementRepositoryAdapter
        implements BonusRequirementRepositoryPort {

    private final BonusRequirementEntityMapper mapper;
    private final BonusRequirementR2dbcRepository r2dbcRepository;

    @Override
    public Mono<BonusRequirement> findById(UUID id) {
        return r2dbcRepository.findById(id)
                .map(mapper::toDomain);
    }

    @Override
    public Flux<BonusRequirement> findAll() {
        return r2dbcRepository.findAll()
                .map(mapper::toDomain);
    }

    @Override
    public Mono<BonusRequirement> save(BonusRequirement bonusRequirement) {
        return r2dbcRepository.save(mapper.toEntity(bonusRequirement))
                .map(mapper::toDomain);
    }

    @Override
    public Mono<Void> deleteById(UUID id) {
        return r2dbcRepository.deleteById(id);
    }

    @Override
    public Flux<BonusRequirement> findByRankId(Long rankId) {
        return r2dbcRepository.findByRankId(rankId)
                .map(mapper::toDomain);
    }

    @Override
    public Flux<BonusRequirement> findByBonusTypeId(Long bonusTypeId) {
        return r2dbcRepository.findByBonusTypeId(bonusTypeId)
                .map(mapper::toDomain);
    }
}