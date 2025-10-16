package world.inclub.bonusesrewards.shared.payment.domain.model;

import java.math.BigDecimal;

public record Wallet(
        Long idWallet,
        Long idUser,
        BigDecimal availableBalance,
        BigDecimal accountingBalance,
        BigDecimal availableBrandExclusive,
        BigDecimal accountingBrandExclusive,
        Integer idCurrency
) {}
