package world.inclub.bonusesrewards.shared.member.infrastructure.persistence.repository;

import org.springframework.data.r2dbc.repository.R2dbcRepository;
import world.inclub.bonusesrewards.shared.member.infrastructure.persistence.entity.MemberEntity;

public interface MemberR2dbcRepository
        extends R2dbcRepository<MemberEntity, Long> {
}
