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
    public record WalletTransaction(
            BigDecimal amount
    ) {}
}
