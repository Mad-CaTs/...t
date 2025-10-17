package world.inclub.bonusesrewards.shared.payment.application.dto;

import java.math.BigDecimal;

public record PaymentAmounts(
        BigDecimal subTotal,
        BigDecimal commission,
        BigDecimal total
) {}
