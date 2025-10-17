package world.inclub.bonusesrewards.shared.payment.application.dto;

import java.math.BigDecimal;

public record ProcessWalletPaymentCommand (
        Long userId,
        BigDecimal amount,
        String detail
) {}
