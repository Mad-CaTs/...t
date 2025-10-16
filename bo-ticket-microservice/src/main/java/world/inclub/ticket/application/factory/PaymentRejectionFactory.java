package world.inclub.ticket.application.factory;

import org.springframework.stereotype.Component;
import world.inclub.ticket.domain.model.payment.PaymentRejection;
import world.inclub.ticket.utils.TimeLima;

import java.time.LocalDateTime;

@Component
public class PaymentRejectionFactory {

    public PaymentRejection createPaymentRejection(Long paymentId, Long reasonId, String detail) {
        LocalDateTime now = TimeLima.getLimaTime();
        
        return PaymentRejection.builder()
                .paymentId(paymentId)
                .reasonId(reasonId)
                .note(detail)
                .createdAt(now)
                .build();
    }

}
