package world.inclub.bonusesrewards.shared.payment.application.factory;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.payment.domain.model.PaymentRejection;

import java.time.Instant;
import java.util.UUID;

@Component
public class PaymentRejectionFactory {

    public PaymentRejection createPaymentRejection(UUID paymentId, Long reasonId, String detail) {
        Instant now = Instant.now();

        return PaymentRejection.builder()
                .paymentId(paymentId)
                .reasonId(reasonId)
                .note(detail)
                .createdAt(now)
                .build();
    }
}
