package world.inclub.bonusesrewards.shared.payment.domain.port;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.member.domain.model.Member;

public interface MemberRepositoryPort {

    Mono<Member> getMemberByIdUser(Long userId);

}
