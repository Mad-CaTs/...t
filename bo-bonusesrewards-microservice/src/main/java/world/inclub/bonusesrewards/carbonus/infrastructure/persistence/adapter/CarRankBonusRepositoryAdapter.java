package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.CarRankBonus;
import world.inclub.bonusesrewards.carbonus.domain.port.CarRankBonusRepositoryPort;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.mapper.CarRankBonusMapper;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository.CarRankBonusR2dbcRepository;

import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class CarRankBonusRepositoryAdapter
        implements CarRankBonusRepositoryPort {

    private final CarRankBonusR2dbcRepository carRankBonusR2dbcRepository;
    private final CarRankBonusMapper carRankBonusMapper;

    @Override
    public Mono<CarRankBonus> save(CarRankBonus carRankBonus) {
        return carRankBonusR2dbcRepository.save(carRankBonusMapper.toEntity(carRankBonus))
                .map(carRankBonusMapper::toDomain);
    }

    @Override
    public Mono<CarRankBonus> findById(UUID id) {
        return carRankBonusR2dbcRepository.findById(id)
                .map(carRankBonusMapper::toDomain);
    }

    @Override
    public Mono<CarRankBonus> findByRankIdAndStatusId(Long rankId, Long statusId) {
        return carRankBonusR2dbcRepository.findByRankIdAndStatusId(rankId, statusId)
                .map(carRankBonusMapper::toDomain);
    }

    @Override
    public Mono<Void> deleteById(UUID id) {
        return carRankBonusR2dbcRepository.deleteById(id);
    }

    @Override
    public Mono<Boolean> existsByStatusIdAndRankId(Long rankId, Long statusId) {
        return carRankBonusR2dbcRepository.existsByStatusIdAndRankId(statusId, rankId);
    }
}
