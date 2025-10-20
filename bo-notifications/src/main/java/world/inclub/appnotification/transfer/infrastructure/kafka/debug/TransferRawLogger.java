package world.inclub.appnotification.transfer.infrastructure.kafka.debug;

import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import world.inclub.appnotification.transfer.infrastructure.kafka.constants.TransferKafkaConstants.Topic;
import world.inclub.appnotification.shared.infrastructure.kafka.constants.KafkaConstants;

@Slf4j
@Component
public class TransferRawLogger {

    @KafkaListener(
        topics = { Topic.REQUEST_SEND_NOTIFICATION, Topic.REQUEST_SEND_NOTIFICATION_LEGACY },
        groupId = KafkaConstants.GROUP_ID + "-raw-debug",
        containerFactory = "transferNotificationRawKafkaListenerContainerFactory"
    )
    public void listen(ConsumerRecord<String, String> record) {
        try {
            log.info("[RAW-LOGGER] topic={} partition={} offset={} key={} value={}", record.topic(), record.partition(), record.offset(), record.key(), record.value());
            record.headers().forEach(h -> log.info("[RAW-LOGGER] header {}={}", h.key(), new String(h.value() == null ? new byte[0] : h.value())));
        } catch (Exception e) {
            log.warn("Failed to log raw record: {}", e.getMessage());
        }
    }
}
