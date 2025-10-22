package world.inclub.bonusesrewards.shared.payment.infrastructure.kafka.dto;

import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
public record WalletPaymentResponseDto (
        WalletTransactionResponse walletTransaction
) {
    @Builder
    public record WalletTransactionResponse(
            Integer idWalletTransaction,
            Integer idWallet,
            Integer idTypeWalletTransaction,
            Integer idCurrency,
            Integer idExchangeRate,
            LocalDateTime initialDate,
            BigDecimal amount,
            Boolean isAvailable,
            LocalDateTime availabilityDate,
            String referenceData,
            Boolean isSuccessfulTransaction
    ) {}
}



