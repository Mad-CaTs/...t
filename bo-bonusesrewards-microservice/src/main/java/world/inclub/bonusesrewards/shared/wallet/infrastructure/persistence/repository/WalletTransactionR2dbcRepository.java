package world.inclub.bonusesrewards.shared.wallet.infrastructure.persistence.repository;

import org.springframework.data.r2dbc.repository.R2dbcRepository;
import world.inclub.bonusesrewards.shared.wallet.infrastructure.persistence.entity.WalletTransactionEntity;

public interface WalletTransactionR2dbcRepository
        extends R2dbcRepository<WalletTransactionEntity, Long> {
}
