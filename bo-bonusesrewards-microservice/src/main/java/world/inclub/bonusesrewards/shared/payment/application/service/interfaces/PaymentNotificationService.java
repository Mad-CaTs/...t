package world.inclub.bonusesrewards.shared.payment.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.payment.application.dto.PaymentNotificationMessage;

public interface PaymentNotificationService {

    Mono<Void> sendPaymentNotification(PaymentNotificationMessage notificationMessage);

}