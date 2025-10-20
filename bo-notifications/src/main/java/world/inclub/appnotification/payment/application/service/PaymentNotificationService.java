package world.inclub.appnotification.payment.application.service;

import reactor.core.publisher.Mono;
import world.inclub.appnotification.payment.application.dto.TicketPaymentNotificationMessage;

public interface PaymentNotificationService {

    /**
     * Sends a notification for an approved ticket-payment.
     *
     * @param message the notification message containing ticket-payment details
     * @return a Mono indicating the success or failure of the operation
     */
    Mono<Boolean> sendTicketPaymentNotification(TicketPaymentNotificationMessage message, String subject, String template);

}
