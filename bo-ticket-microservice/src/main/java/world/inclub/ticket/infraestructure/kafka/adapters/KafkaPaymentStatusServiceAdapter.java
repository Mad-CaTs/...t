package world.inclub.ticket.infraestructure.kafka.adapters;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import world.inclub.ticket.application.dto.TicketPaymentNotificationMessage;
import world.inclub.ticket.application.port.payment.PaymentStatusService;
import world.inclub.ticket.infraestructure.kafka.constants.KafkaConstants.Topic;

@Slf4j
@Component
@RequiredArgsConstructor
public class KafkaPaymentStatusServiceAdapter implements PaymentStatusService {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Override
    public Mono<Void> sendPaymentNotification(TicketPaymentNotificationMessage notificationMessage) {
        return Mono.fromRunnable(() -> {
            kafkaTemplate.send(Topic.Notification.REQUEST_SEND_NOTIFICATION, notificationMessage);
        }).then();
    }

}
