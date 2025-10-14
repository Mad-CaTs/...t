package world.inclub.bonusesrewards.shared.member.application.usecase;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.member.domain.model.Member;

public interface GetMemberUseCase {

    /**
     * Get a member by their unique identifier.
     *
     * @param idUser the unique identifier of the member
     * @return a Mono emitting the Member if found, or empty if not found
     */
    Mono<Member> getById(Long idUser);

}
