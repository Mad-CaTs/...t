package world.inclub.ticket.application.port.payment;

import reactor.core.publisher.Mono;
import world.inclub.ticket.application.dto.TicketPaymentNotificationMessage;

public interface PaymentStatusService {

    /**
     * Sends a notification for an approved payment.
     *
     * @param notificationMessage the message containing the details of the payment notification
     * @return a Mono that completes when the notification has been sent
     */
    Mono<Void> sendPaymentNotification(TicketPaymentNotificationMessage notificationMessage);

}
