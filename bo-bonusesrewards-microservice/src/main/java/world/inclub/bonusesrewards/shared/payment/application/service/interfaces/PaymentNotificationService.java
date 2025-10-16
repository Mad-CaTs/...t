package world.inclub.bonusesrewards.shared.payment.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.payment.domain.model.Payment;
import world.inclub.bonusesrewards.shared.payment.domain.model.PaymentRejection;

public interface PaymentNotificationService {

    Mono<Void> sendPaymentNotification(Payment payment);

    Mono<Void> sendPaymentRejectionNotification(Payment payment, PaymentRejection rejection);
}