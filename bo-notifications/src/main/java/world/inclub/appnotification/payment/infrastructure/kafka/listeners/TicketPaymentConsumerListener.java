package world.inclub.appnotification.payment.infrastructure.kafka.listeners;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import world.inclub.appnotification.payment.application.dto.TicketPaymentNotificationMessage;
import world.inclub.appnotification.payment.application.service.PaymentNotificationService;
import world.inclub.appnotification.payment.infrastructure.email.adapters.PaymentEmailBuilderAdapter;
import world.inclub.appnotification.payment.infrastructure.kafka.constants.PaymentKafkaConstants.Topic;
import world.inclub.appnotification.shared.infrastructure.kafka.constants.KafkaConstants;

@Slf4j
@Component
@RequiredArgsConstructor
public class TicketPaymentConsumerListener {

    private final PaymentNotificationService paymentNotificationService;
    private final PaymentEmailBuilderAdapter paymentEmailBuilderAdapter;

    @KafkaListener(
            topics = Topic.Notification.REQUEST_SEND_NOTIFICATION,
            groupId = KafkaConstants.GROUP_ID,
            containerFactory = "paymentNotificationKafkaListenerContainerFactory"
    )
    public void consume(TicketPaymentNotificationMessage message) {
        String templateHtml = paymentEmailBuilderAdapter.buildHtml(message);
        String subject = paymentEmailBuilderAdapter.getSubject();
        paymentNotificationService
                .sendTicketPaymentNotification(message, subject, templateHtml)
                .subscribe();
    }

}
