package world.inclub.appnotification.bonusrewards.infrastructure.kafka.listeners;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import world.inclub.appnotification.bonusrewards.application.dto.PaymentNotificationMessage;
import world.inclub.appnotification.bonusrewards.application.service.BonusPaymentNotificationService;
import world.inclub.appnotification.bonusrewards.infrastructure.email.adapters.BonusPaymentEmailBuilderAdapter;
import world.inclub.appnotification.bonusrewards.infrastructure.kafka.constants.BonusPaymentKafkaConstants.Topic;
import world.inclub.appnotification.shared.infrastructure.kafka.constants.KafkaConstants;

@Slf4j
@Component
@RequiredArgsConstructor
public class BonusPaymentConsumerListener {

    private final BonusPaymentNotificationService paymentNotificationService;
    private final BonusPaymentEmailBuilderAdapter paymentEmailBuilderAdapter;

    @KafkaListener(
            topics = Topic.Notification.REQUEST_SEND_NOTIFICATION,
            groupId = KafkaConstants.GROUP_ID,
            containerFactory = "bonusPaymentNotificationKafkaListenerContainerFactory"
    )
    public void consume(PaymentNotificationMessage message) {
        String templateHtml = paymentEmailBuilderAdapter.buildHtml(message);
        String subject = paymentEmailBuilderAdapter.getSubject();
        paymentNotificationService
                .sendPaymentNotification(message, subject, templateHtml)
                .subscribe();
    }

}
