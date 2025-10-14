package world.inclub.bonusesrewards.shared.bonus.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.bonus.domain.model.ClassificationWithMember;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

public interface ClassificationWithMemberRepositoryPort {

    Flux<ClassificationWithMember> findAll(String member, Long rankId, Boolean notificationStatus);

    Flux<ClassificationWithMember> findAll(String member, Long rankId, Boolean notificationStatus, Pageable pageable);

    Mono<Long> countClassifications(String member, Long rankId, Boolean notificationStatus);
}