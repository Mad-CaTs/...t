package world.inclub.ticket.infraestructure.kafka.dto;

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