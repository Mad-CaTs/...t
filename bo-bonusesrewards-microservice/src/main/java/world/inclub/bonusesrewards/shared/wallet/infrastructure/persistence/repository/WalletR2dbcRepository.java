package world.inclub.bonusesrewards.shared.wallet.infrastructure.persistence.repository;

import org.springframework.data.r2dbc.repository.R2dbcRepository;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.wallet.infrastructure.persistence.entity.WalletEntity;

public interface WalletR2dbcRepository
        extends R2dbcRepository<WalletEntity, Long> {
    Mono<WalletEntity> findByMemberId(Long memberId);
}
