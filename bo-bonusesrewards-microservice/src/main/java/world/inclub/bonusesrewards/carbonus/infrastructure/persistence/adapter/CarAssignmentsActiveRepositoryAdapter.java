package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.criteria.CarAssignmentsActiveSearchCriteria;
import world.inclub.bonusesrewards.carbonus.domain.model.CarAssignmentsActive;
import world.inclub.bonusesrewards.carbonus.domain.port.CarAssignmentsActiveRepositoryPort;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarAssignmentsActiveViewEntity;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.mapper.CarAssignmentsActiveMapper;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository.CarAssignmentsActiveR2dbcRepository;
import world.inclub.bonusesrewards.shared.exceptions.EntityNotFoundException;
import world.inclub.bonusesrewards.shared.rank.domain.model.MemberRankDetail;
import world.inclub.bonusesrewards.shared.rank.domain.port.MemberRankDetailRepositoryPort;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

@Component
@RequiredArgsConstructor
public class CarAssignmentsActiveRepositoryAdapter
        implements CarAssignmentsActiveRepositoryPort {

    private final CarAssignmentsActiveR2dbcRepository carAssignmentsActiveR2DbcRepository;
    private final MemberRankDetailRepositoryPort memberRankDetailRepositoryPort;
    private final CarAssignmentsActiveMapper carAssignmentsActiveMapper;

    @Override
    public Flux<CarAssignmentsActive> findAll() {
        return carAssignmentsActiveR2DbcRepository.findAll()
                .switchIfEmpty(Mono.error(new EntityNotFoundException("No active car assignments found.")))
                .collectMap(CarAssignmentsActiveViewEntity::getMemberId)
                .flatMapMany(memberMap -> memberRankDetailRepositoryPort
                        .findByMemberIdIn(memberMap.keySet())
                        .collectMap(MemberRankDetail::memberId)
                        .flatMapMany(rankMap -> Flux.fromIterable(memberMap.values())
                                .map(entity -> carAssignmentsActiveMapper
                                        .toDomain(entity, rankMap.get(entity.getMemberId())))));
    }

    @Override
    public Flux<CarAssignmentsActive> findAll(CarAssignmentsActiveSearchCriteria criteria, Pageable pageable) {
        CarAssignmentsActiveSearchCriteria searchCriteria = emptyIfNull(criteria);

        return carAssignmentsActiveR2DbcRepository.findWithFilters(
                        searchCriteria.member(),
                        searchCriteria.modelName(),
                        searchCriteria.startDate(),
                        searchCriteria.endDate(),
                        pageable.limit(),
                        pageable.offset()
                )
                .collectMap(CarAssignmentsActiveViewEntity::getMemberId)
                .flatMapMany(memberMap -> memberRankDetailRepositoryPort
                        .findByMemberIdIn(memberMap.keySet())
                        .collectMap(MemberRankDetail::memberId)
                        .flatMapMany(rankMap -> Flux.fromIterable(memberMap.values())
                                .map(entity -> carAssignmentsActiveMapper
                                        .toDomain(entity, rankMap.get(entity.getMemberId())))));
    }

    @Override
    public Mono<Long> countCarAssignmentsActive(CarAssignmentsActiveSearchCriteria criteria) {
        CarAssignmentsActiveSearchCriteria searchCriteria = emptyIfNull(criteria);
        return carAssignmentsActiveR2DbcRepository.countWithFilters(
                searchCriteria.member(),
                searchCriteria.modelName(),
                searchCriteria.startDate(),
                searchCriteria.endDate()
        );
    }

    private CarAssignmentsActiveSearchCriteria emptyIfNull(CarAssignmentsActiveSearchCriteria criteria) {
        return criteria != null ? criteria : CarAssignmentsActiveSearchCriteria.empty();
    }

}