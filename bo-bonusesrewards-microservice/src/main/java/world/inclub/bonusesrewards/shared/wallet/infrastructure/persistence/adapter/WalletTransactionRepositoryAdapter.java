package world.inclub.bonusesrewards.shared.wallet.infrastructure.persistence.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.shared.wallet.domain.model.WalletTransaction;
import world.inclub.bonusesrewards.shared.wallet.domain.port.WalletTransactionRepositoryPort;
import world.inclub.bonusesrewards.shared.wallet.infrastructure.persistence.entity.WalletTransactionEntity;
import world.inclub.bonusesrewards.shared.wallet.infrastructure.persistence.mapper.WalletTransactionEntityMapper;
import world.inclub.bonusesrewards.shared.wallet.infrastructure.persistence.repository.WalletTransactionR2dbcRepository;

import java.util.stream.StreamSupport;

@Repository
@RequiredArgsConstructor
public class WalletTransactionRepositoryAdapter
        implements WalletTransactionRepositoryPort {

    private final WalletTransactionR2dbcRepository walletTransactionR2dbcRepository;
    private final WalletTransactionEntityMapper walletTransactionEntityMapper;

    @Override
    public Flux<WalletTransaction> saveAll(Iterable<WalletTransaction> transactions) {
        Iterable<WalletTransactionEntity> entities = StreamSupport.stream(transactions.spliterator(), false)
                .map(walletTransactionEntityMapper::toEntity)
                .toList();
        return walletTransactionR2dbcRepository.saveAll(entities)
                .map(walletTransactionEntityMapper::toDomain);
    }

}
