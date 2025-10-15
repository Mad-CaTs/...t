package world.inclub.bonusesrewards.shared.member.infrastructure.persistence.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.member.domain.model.Member;
import world.inclub.bonusesrewards.shared.member.domain.port.MemberRepositoryPort;
import world.inclub.bonusesrewards.shared.member.infrastructure.persistence.mapper.MemberEntityMapper;
import world.inclub.bonusesrewards.shared.member.infrastructure.persistence.repository.MemberR2dbcRepository;

@Repository
@RequiredArgsConstructor
public class MemberRepositoryAdapter
        implements MemberRepositoryPort {
    private final MemberEntityMapper memberEntityMapper;
    private final MemberR2dbcRepository memberR2dbcRepository;

    @Override
    public Mono<Boolean> existsById(Long id) {
        return memberR2dbcRepository.existsById(id);
    }

    @Override
    public Mono<Member> getById(Long id) {
        return memberR2dbcRepository.findById(id)
                .map(memberEntityMapper::toDomain);
    }

    @Override
    public Flux<Member> getByIdIn(Iterable<Long> memberIds) {
        return memberR2dbcRepository.findAllById(memberIds)
                .map(memberEntityMapper::toDomain);
    }
}
