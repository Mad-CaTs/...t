package world.inclub.bonusesrewards.shared.payment.infrastructure.kafka.dto;

import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record ProcessWalletPaymentDto(
        Long idUserPayment,
        WalletTransaction walletTransaction,
        Integer typeWalletTransaction,
        Boolean isFullPayment,
        String detailPayment
) {
    @Builder
    public record WalletTransaction(
            Integer idWallet,
            Integer idTypeWalletTransaction,
            Integer idCurrency,
            Integer idExchangeRate,
            BigDecimal amount,
            Boolean isAvailable,
            String availabilityDate,
            String referenceData
    ) {}
}
