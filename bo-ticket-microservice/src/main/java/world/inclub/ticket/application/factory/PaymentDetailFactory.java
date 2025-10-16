package world.inclub.ticket.application.factory;

import org.springframework.stereotype.Component;
import world.inclub.ticket.application.dto.PaymentAmounts;
import world.inclub.ticket.domain.model.payment.Payment;
import world.inclub.ticket.domain.model.payment.PaymentDetail;
import world.inclub.ticket.utils.TimeLima;

import java.time.LocalDateTime;

@Component
public class PaymentDetailFactory {

    public PaymentDetail create(Payment payment, PaymentAmounts.PaymentItem item) {
        LocalDateTime now = TimeLima.getLimaTime();
        return PaymentDetail.builder()
                .paymentId(payment.getId())
                .itemTypeId(item.itemTypeId())
                .itemId(item.itemId())
                .ticketQuantity(item.quantity())
                .unitPrice(item.unitPrice())
                .totalPrice(item.totalPrice())
                .createdAt(now)
                .build();
    }

}
