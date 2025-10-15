package world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.bonus.domain.model.ClassificationWithMember;
import world.inclub.bonusesrewards.shared.bonus.domain.port.ClassificationWithMemberRepositoryPort;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.mapper.ClassificationWithMemberMapper;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.repository.ClassificationWithMemberR2dbcRepository;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

@Repository
@RequiredArgsConstructor
public class ClassificationWithMemberRepositoryAdapter
        implements ClassificationWithMemberRepositoryPort {

    private final ClassificationWithMemberR2dbcRepository classificationsR2dbcRepository;
    private final ClassificationWithMemberMapper classificationWithMemberMapper;

    @Override
    public Flux<ClassificationWithMember> findAll(
            String member,
            Long rankId,
            Boolean notificationStatus
    ) {
        return classificationsR2dbcRepository.findWithFilters(member, rankId, notificationStatus)
                .map(classificationWithMemberMapper::toDomain);
    }

    @Override
    public Flux<ClassificationWithMember> findAll(
            String member,
            Long rankId,
            Boolean notificationStatus,
            Pageable pageable
    ) {
        return classificationsR2dbcRepository.findWithFiltersPageable(
                        member,
                        rankId,
                        notificationStatus,
                        pageable.limit(),
                        pageable.offset()
                )
                .map(classificationWithMemberMapper::toDomain);
    }

    @Override
    public Mono<Long> countClassifications(String member, Long rankId, Boolean notificationStatus) {
        return classificationsR2dbcRepository.countWithFilters(member, rankId, notificationStatus);
    }

}