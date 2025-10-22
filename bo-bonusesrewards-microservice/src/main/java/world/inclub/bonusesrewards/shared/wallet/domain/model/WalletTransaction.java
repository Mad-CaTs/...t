package world.inclub.bonusesrewards.shared.wallet.domain.model;

import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
public record WalletTransaction(
    Long id,
    Long walletId,
    Long walletTransactionTypeId,
    Long currencyId,
    Long exchangeRateId,
    LocalDateTime initiatedAt,
    BigDecimal amount,
    Boolean isAvailable,
    LocalDateTime availableAt,
    String reference,
    Boolean isSuccessful
) {}
