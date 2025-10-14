package world.inclub.ticket.domain.ports;

import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.model.Member;

public interface MemberRepositoryPort {

    Mono<Member> getMemberByIdUser(Long userId);

}
