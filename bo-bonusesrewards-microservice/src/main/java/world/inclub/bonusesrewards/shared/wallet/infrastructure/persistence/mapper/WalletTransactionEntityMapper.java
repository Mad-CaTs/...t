package world.inclub.bonusesrewards.shared.wallet.infrastructure.persistence.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.wallet.domain.model.WalletTransaction;
import world.inclub.bonusesrewards.shared.wallet.infrastructure.persistence.entity.WalletTransactionEntity;

@Component
public class WalletTransactionEntityMapper {

    public WalletTransaction toDomain(WalletTransactionEntity entity) {
        return WalletTransaction.builder()
                .id(entity.getId())
                .walletId(entity.getWalletId())
                .walletTransactionTypeId(entity.getWalletTransactionTypeId())
                .currencyId(entity.getCurrencyId())
                .exchangeRateId(entity.getExchangeRateId())
                .initiatedAt(entity.getInitiatedAt())
                .amount(entity.getAmount())
                .isAvailable(entity.getIsAvailable())
                .availableAt(entity.getAvailableAt())
                .reference(entity.getReference())
                .isSuccessful(entity.getIsSuccessful())
                .build();
    }

    public WalletTransactionEntity toEntity(WalletTransaction domain) {
        WalletTransactionEntity entity = new WalletTransactionEntity();
        entity.setId(domain.id());
        entity.setWalletId(domain.walletId());
        entity.setWalletTransactionTypeId(domain.walletTransactionTypeId());
        entity.setCurrencyId(domain.currencyId());
        entity.setExchangeRateId(domain.exchangeRateId());
        entity.setInitiatedAt(domain.initiatedAt());
        entity.setAmount(domain.amount());
        entity.setIsAvailable(domain.isAvailable());
        entity.setAvailableAt(domain.availableAt());
        entity.setReference(domain.reference());
        entity.setIsSuccessful(domain.isSuccessful());
        return entity;
    }

}