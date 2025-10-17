package world.inclub.bonusesrewards.shared.payment.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.payment.application.dto.PaymentNotificationMessage;
import world.inclub.bonusesrewards.shared.payment.application.service.interfaces.PaymentNotificationService;
import world.inclub.bonusesrewards.shared.payment.infrastructure.kafka.constants.KafkaConstants.Topic;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentNotificationServiceImpl implements PaymentNotificationService {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Override
    public Mono<Void> sendPaymentNotification(PaymentNotificationMessage notificationMessage) {
        return Mono.fromRunnable(() -> {
            kafkaTemplate.send(Topic.Notification.REQUEST_SEND_NOTIFICATION, notificationMessage);
        }).then();
    }
}
