package world.inclub.bonusesrewards.shared.wallet.infrastructure.persistence.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.wallet.domain.model.Wallet;
import world.inclub.bonusesrewards.shared.wallet.domain.port.WalletRepositoryPort;
import world.inclub.bonusesrewards.shared.wallet.infrastructure.persistence.mapper.WalletEntityMapper;
import world.inclub.bonusesrewards.shared.wallet.infrastructure.persistence.repository.WalletR2dbcRepository;

@Repository
@RequiredArgsConstructor
public class WalletRepositoryAdapter
        implements WalletRepositoryPort {

    private final WalletR2dbcRepository walletR2dbcRepository;
    private final WalletEntityMapper walletEntityMapper;

    @Override
    public Mono<Wallet> save(Wallet wallet) {
        return walletR2dbcRepository
                .save(walletEntityMapper.toEntity(wallet))
                .map(walletEntityMapper::toDomain);
    }

    @Override
    public Mono<Wallet> findByMemberId(Long memberId) {
        return walletR2dbcRepository
                .findByMemberId(memberId)
                .map(walletEntityMapper::toDomain);
    }

}
