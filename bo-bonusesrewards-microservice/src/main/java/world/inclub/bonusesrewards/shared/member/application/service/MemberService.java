package world.inclub.bonusesrewards.shared.member.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.exceptions.EntityNotFoundException;
import world.inclub.bonusesrewards.shared.member.application.usecase.CheckMemberExistsUseCase;
import world.inclub.bonusesrewards.shared.member.application.usecase.GetMemberUseCase;
import world.inclub.bonusesrewards.shared.member.domain.model.Member;
import world.inclub.bonusesrewards.shared.member.domain.port.MemberRepositoryPort;

@Service
@RequiredArgsConstructor
public class MemberService
        implements GetMemberUseCase,
                   CheckMemberExistsUseCase {

    private final MemberRepositoryPort memberRepositoryPort;

    @Override
    public Mono<Boolean> existsById(Long id) {
        return memberRepositoryPort.existsById(id);
    }

    @Override
    public Mono<Member> getById(Long idUser) {
        return memberRepositoryPort.getById(idUser)
                .switchIfEmpty(Mono.error(new EntityNotFoundException("Member not found")));
    }
}
