package world.inclub.appnotification.bonusrewards.application.service;

import reactor.core.publisher.Mono;
import world.inclub.appnotification.bonusrewards.application.dto.PaymentNotificationMessage;

public interface BonusPaymentNotificationService {
    Mono<Boolean> sendPaymentNotification(PaymentNotificationMessage message, String subject, String template);

}
