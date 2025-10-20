package world.inclub.appnotification.transfer.infrastructure.kafka.listeners;

import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;
import world.inclub.appnotification.transfer.infrastructure.kafka.constants.TransferKafkaConstants.Topic;
import world.inclub.appnotification.shared.infrastructure.kafka.constants.KafkaConstants;

 

@Slf4j
@Component
public class TransferNotificationRawLogger {

    @KafkaListener(topics = { Topic.REQUEST_SEND_NOTIFICATION, Topic.REQUEST_SEND_NOTIFICATION_LEGACY },
        groupId = KafkaConstants.GROUP_ID + "-raw-debug",
        containerFactory = "transferNotificationRawKafkaListenerContainerFactory")
    public void logRaw(String payload, @Header(name = "kafka_receivedMessageKey", required = false) String key, @Header(name = "kafka_receivedPartitionId", required = false) Integer partition) {
        try {
            log.info("[RAW-PAYLOAD] key={} partition={} payload={}", key, partition, payload == null ? "<null>" : payload);
        } catch (Exception e) {
            log.warn("Failed to log raw payload: {}", e.getMessage());
        }
    }
}
