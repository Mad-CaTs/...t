package world.inclub.bonusesrewards.shared.payment.application.factory;

import org.springframework.stereotype.Component;
import reactor.util.function.Tuple2;
import world.inclub.bonusesrewards.shared.payment.application.dto.PaymentNotificationMessage;
import world.inclub.bonusesrewards.shared.payment.domain.model.Payment;
import world.inclub.bonusesrewards.shared.payment.domain.model.PaymentRejection;

@Component
public class PaymentNotificationFactory {
    public PaymentNotificationMessage toApprovedPaymentMessage(Tuple2<String, String> userData, Payment payment) {
        return PaymentNotificationMessage.builder()
                .user(PaymentNotificationMessage.User.builder()
                        .email(userData.getT1())
                        .fullName(userData.getT2())
                        .build())
                .status(payment.getStatus())
                .build();
    }

    public PaymentNotificationMessage toTemporalRejectedPaymentMessage(Tuple2<String, String> userData, Payment payment, PaymentRejection paymentRejection) {
        return PaymentNotificationMessage.builder()
                .user(PaymentNotificationMessage.User.builder()
                        .email(userData.getT1())
                        .fullName(userData.getT2())
                        .build())
                .rejectedPayment(PaymentNotificationMessage.RejectedPayment.builder()
                        .reason(paymentRejection.getNote())
                        .rejectedAt(paymentRejection.getCreatedAt())
                        .build())
                .status(payment.getStatus())
                .build();
    }
}
