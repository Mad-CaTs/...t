package world.inclub.membershippayment.infraestructure.config.kafka.topics;

import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.common.config.TopicConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;
import world.inclub.membershippayment.infraestructure.config.kafka.constants.KafkaConstants.Topic;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaTopicPaymentVoucher {

    @Bean
    public NewTopic generateTopicPaymentVoucher() {
        Map<String, String> config = new HashMap<>();
        config.put(TopicConfig.CLEANUP_POLICY_CONFIG, TopicConfig.CLEANUP_POLICY_COMPACT);
        config.put(TopicConfig.RETENTION_MS_CONFIG, "172800000");
        config.put(TopicConfig.SEGMENT_MS_CONFIG, "604800000");
        config.put(TopicConfig.MIN_COMPACTION_LAG_MS_CONFIG, "86400000");

        return TopicBuilder.name(Topic.TOPIC_PAYMENTVOUCHER)
                .partitions(1)
                .replicas(1)
                .configs(config)
                .build();
    }

}