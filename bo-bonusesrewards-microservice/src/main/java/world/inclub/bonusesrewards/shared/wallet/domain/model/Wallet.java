package world.inclub.bonusesrewards.shared.wallet.domain.model;

import lombok.Builder;

import java.math.BigDecimal;

@Builder(toBuilder = true)
public record Wallet(
        Long id,
        Long memberId,
        Long currencyId,
        BigDecimal availableBalance,
        BigDecimal accountingBalance,
        BigDecimal availableBrandExclusive,
        BigDecimal accountingBrandExclusive
) {}
