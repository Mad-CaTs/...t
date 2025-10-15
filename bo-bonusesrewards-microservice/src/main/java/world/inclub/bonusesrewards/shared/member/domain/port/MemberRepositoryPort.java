package world.inclub.bonusesrewards.shared.member.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.member.domain.model.Member;

public interface MemberRepositoryPort {
    Mono<Boolean> existsById(Long id);

    Mono<Member> getById(Long id);

    Flux<Member> getByIdIn(Iterable<Long> memberIds);
}
