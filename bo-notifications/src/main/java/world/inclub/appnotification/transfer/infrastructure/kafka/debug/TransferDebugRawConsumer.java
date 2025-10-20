package world.inclub.appnotification.transfer.infrastructure.kafka.debug;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import world.inclub.appnotification.transfer.infrastructure.kafka.constants.TransferKafkaConstants.Topic;
import world.inclub.appnotification.shared.infrastructure.kafka.constants.KafkaConstants;

@Slf4j
@Profile("debug")
@Component
public class TransferDebugRawConsumer {

    @KafkaListener(topics = { Topic.REQUEST_SEND_NOTIFICATION, Topic.REQUEST_SEND_NOTIFICATION_LEGACY }, groupId = KafkaConstants.GROUP_ID + "-raw-consumer", containerFactory = "transferNotificationRawKafkaListenerContainerFactory")
    public void listenRaw(String payload) {
        log.info("[RAW-CONSUMER] Received raw payload: {}", payload);
    }
}
