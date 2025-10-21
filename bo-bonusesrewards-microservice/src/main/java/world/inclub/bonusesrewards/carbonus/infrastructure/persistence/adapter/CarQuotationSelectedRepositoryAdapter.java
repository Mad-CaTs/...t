package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarQuotationPendingAssignment;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarQuotationSelected;
import world.inclub.bonusesrewards.carbonus.domain.port.CarQuotationSelectedRepositoryPort;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarQuotationPendingAssignmentViewEntity;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarQuotationSelectedViewEntity;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.mapper.CarQuotationSelectedViewEntityMapper;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository.CarQuotationSelectedR2dbcRepository;
import world.inclub.bonusesrewards.shared.rank.domain.model.Rank;
import world.inclub.bonusesrewards.shared.rank.domain.port.RankRepositoryPort;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

@Repository
@RequiredArgsConstructor
public class CarQuotationSelectedRepositoryAdapter
        implements CarQuotationSelectedRepositoryPort {

    private final CarQuotationSelectedR2dbcRepository carQuotationSelectedR2dbcRepository;
    private final RankRepositoryPort rankRepositoryPort;
    private final CarQuotationSelectedViewEntityMapper carQuotationSelectedViewEntityMapper;

    @Override
    public Flux<CarQuotationSelected> findWithFilters(
            String member,
            Long rankId,
            Pageable pageable
    ) {
        return findSelected(
                carQuotationSelectedR2dbcRepository
                        .findWithFilters(member, rankId, pageable.limit(), pageable.offset())
        );
    }

    @Override
    public Mono<Long> countWithFilters(String member, Long rankId) {
        return carQuotationSelectedR2dbcRepository
                .countWithFilters(member, rankId);
    }

    @Override
    public Flux<CarQuotationSelected> findAll(String member, Long rankId) {
        return findSelected(
                carQuotationSelectedR2dbcRepository
                        .findAllWithFilters(member, rankId)
        );
    }

    @Override
    public Flux<CarQuotationPendingAssignment> getAllPending() {
        return carQuotationSelectedR2dbcRepository.getAll()
                .collectMap(CarQuotationPendingAssignmentViewEntity::getRankId)
                .flatMapMany(rankMap -> rankRepositoryPort
                .findByIds(rankMap.keySet().stream().distinct().toList())
                        .collectMap(Rank::id)
                        .flatMapMany(rankMapNames -> Flux.fromIterable(rankMap.values())
                                .map(entity -> new CarQuotationPendingAssignment(
                                        entity.getQuotationId(),
                                        entity.getUsername(),
                                        entity.getMemberFullName(),
                                        rankMapNames.getOrDefault(entity.getRankId(), Rank.empty()).name()
                                ))
                        )
                );
    }

    private Flux<CarQuotationSelected> findSelected(Flux<CarQuotationSelectedViewEntity> source) {
        return source
                .collectMap(CarQuotationSelectedViewEntity::getMemberId)
                .flatMapMany(memberMap -> rankRepositoryPort
                        .findByIds(
                                memberMap.values().stream()
                                        .map(CarQuotationSelectedViewEntity::getRankId)
                                        .distinct()
                                        .toList()
                        )
                        .collectMap(Rank::id)
                        .flatMapMany(rankMap -> Flux.fromIterable(memberMap.values())
                                .map(entity -> carQuotationSelectedViewEntityMapper
                                        .toDomain(entity, rankMap.get(entity.getRankId()))))
                );
    }

}