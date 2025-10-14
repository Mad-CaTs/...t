package world.inclub.bonusesrewards.shared.rank.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.rank.domain.model.MemberRankDetail;

public interface MemberRankDetailRepositoryPort {

    Flux<MemberRankDetail> findByMemberIdIn(Iterable<Long> memberIds);

    Mono<MemberRankDetail> findByMemberId(Long id);

}
