package world.inclub.bonusesrewards.shared.payment.application.factory;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.payment.domain.model.PaymentRejection;
import world.inclub.bonusesrewards.shared.utils.TimeLima;

import java.time.LocalDateTime;
import java.util.UUID;

@Component
public class PaymentRejectionFactory {

    public PaymentRejection createPaymentRejection(UUID paymentId, Long reasonId, String detail) {
        LocalDateTime now = TimeLima.getLimaTime();
        return PaymentRejection.builder()
                .id(null)
                .paymentId(paymentId)
                .reasonId(reasonId)
                .note(detail)
                .createdAt(now)
                .build();
    }
}
