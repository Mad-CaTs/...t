package world.inclub.bonusesrewards.shared.member.application.usecase;

import reactor.core.publisher.Mono;

public interface CheckMemberExistsUseCase {

    /**
     * Checks if a member exists by their ID.
     *
     * @param id the ID of the member to check
     * @return a Mono emitting true if the member exists, false otherwise
     */
    Mono<Boolean> existsById(Long id);

}
