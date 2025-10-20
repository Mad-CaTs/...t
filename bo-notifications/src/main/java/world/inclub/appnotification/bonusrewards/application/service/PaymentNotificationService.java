package world.inclub.appnotification.bonusrewards.application.service;

import reactor.core.publisher.Mono;
import world.inclub.appnotification.bonusrewards.application.dto.PaymentNotificationMessage;

public interface PaymentNotificationService {
    Mono<Boolean> sendPaymentNotification(PaymentNotificationMessage message, String subject, String template);

}
