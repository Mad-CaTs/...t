package world.inclub.bonusesrewards.shared.wallet.infrastructure.persistence.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.wallet.domain.model.Wallet;
import world.inclub.bonusesrewards.shared.wallet.infrastructure.persistence.entity.WalletEntity;

@Component
public class WalletEntityMapper {

    public Wallet toDomain(WalletEntity entity) {
        return Wallet.builder()
                .id(entity.getId())
                .memberId(entity.getMemberId())
                .currencyId(entity.getCurrencyId())
                .availableBalance(entity.getAvailableBalance())
                .accountingBalance(entity.getAccountingBalance())
                .availableBrandExclusive(entity.getAvailableBrandExclusive())
                .accountingBrandExclusive(entity.getAccountingBrandExclusive())
                .build();
    }

    public WalletEntity toEntity(Wallet domain) {
        return WalletEntity.builder()
                .id(domain.id())
                .memberId(domain.memberId())
                .currencyId(domain.currencyId())
                .availableBalance(domain.availableBalance())
                .accountingBalance(domain.accountingBalance())
                .availableBrandExclusive(domain.availableBrandExclusive())
                .accountingBrandExclusive(domain.accountingBrandExclusive())
                .build();
    }

}
