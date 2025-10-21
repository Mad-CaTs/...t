package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.CarRankBonus;
import world.inclub.bonusesrewards.carbonus.domain.port.CarRankBonusRepositoryPort;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.mapper.CarRankBonusMapper;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository.CarRankBonusR2dbcRepository;
import world.inclub.bonusesrewards.shared.infrastructure.context.TimezoneContext;

import java.time.Instant;
import java.time.ZoneId;
import java.util.Collection;
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
        return carRankBonusR2dbcRepository.findByRankIdAndStatusIdAndExpirationDateIsAfter(rankId, statusId, getNow())
                .map(carRankBonusMapper::toDomain);
    }

    @Override
    public Flux<CarRankBonus> findByStatusId(Long statusId) {
        return carRankBonusR2dbcRepository.findByStatusIdAndExpirationDateIsAfter(statusId, getNow())
                .map(carRankBonusMapper::toDomain);
    }


    @Override
    public Mono<Void> deleteById(UUID id) {
        return carRankBonusR2dbcRepository.deleteById(id);
    }

    @Override
    public Mono<Boolean> existsByStatusIdAndRankId(Long rankId, Long statusId) {
        return carRankBonusR2dbcRepository.existsByStatusIdAndRankIdAndExpirationDateIsAfter(statusId, rankId, getNow());
    }

    private Instant getNow() {
        ZoneId zoneId = TimezoneContext.getTimezone();
        return Instant.now().atZone(zoneId).toInstant();
    }

}
