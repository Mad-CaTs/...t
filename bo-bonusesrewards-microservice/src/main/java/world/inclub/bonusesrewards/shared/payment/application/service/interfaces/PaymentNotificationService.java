package world.inclub.bonusesrewards.shared.payment.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.payment.application.dto.PaymentNotificationMessage;
import world.inclub.bonusesrewards.shared.payment.domain.model.Payment;

public interface PaymentNotificationService {

    Mono<Void> sendPaymentNotification(PaymentNotificationMessage notificationMessage);

}