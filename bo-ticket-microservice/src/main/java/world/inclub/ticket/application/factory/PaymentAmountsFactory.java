package world.inclub.ticket.application.factory;

import org.springframework.stereotype.Component;
import world.inclub.ticket.application.dto.PaymentAmounts;

import java.math.BigDecimal;
import java.math.RoundingMode;

import static world.inclub.ticket.domain.model.payment.PaymentDetailItemTypeEnum.*;

@Component
public class PaymentAmountsFactory {

    public PaymentAmounts.PaymentItem createPaymentItem(
            Long packageId,
            Long eventZoneId,
            Integer quantity,
            BigDecimal unitPrice,
            Integer packageQuantity
    ) {
        Long itemTypeId = packageId != null ? PACKAGE.getId() : ZONE.getId();
        Long itemId = packageId != null ? packageId : eventZoneId;
        BigDecimal normalizedUnitPrice = unitPrice.setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalPrice;
        if (packageId != null) {
            totalPrice = normalizedUnitPrice
                    .multiply(BigDecimal.valueOf(packageQuantity))
                    .setScale(2, RoundingMode.HALF_UP);
        } else {
            totalPrice = normalizedUnitPrice
                    .multiply(BigDecimal.valueOf(quantity))
                    .setScale(2, RoundingMode.HALF_UP);
        }
        return new PaymentAmounts.PaymentItem(itemTypeId, itemId, quantity, normalizedUnitPrice, totalPrice);
    }
}
