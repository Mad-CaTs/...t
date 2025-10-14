package world.inclub.ticket.application.dto;

import java.math.BigDecimal;
import java.util.List;

public record PaymentAmounts(
        BigDecimal subTotal,
        BigDecimal commission,
        BigDecimal total,
        List<PaymentItem> items
) {
    public record PaymentItem(
            Long itemTypeId,
            Long itemId,
            Integer quantity,
            BigDecimal unitPrice,
            BigDecimal totalPrice
    ) {}
}
