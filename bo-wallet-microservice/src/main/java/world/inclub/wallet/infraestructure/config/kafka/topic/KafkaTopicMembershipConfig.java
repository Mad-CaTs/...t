package world.inclub.wallet.infraestructure.config.kafka.topic;

import java.util.HashMap;
import java.util.Map;

import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.common.config.TopicConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicMembershipConfig {

    @Bean
    public NewTopic generateTopicRequestWallet() {

        Map<String, String> config = new HashMap<>();
        config.put(TopicConfig.CLEANUP_POLICY_CONFIG, TopicConfig.CLEANUP_POLICY_COMPACT);
        config.put(TopicConfig.RETENTION_MS_CONFIG, "21600000");
        config.put(TopicConfig.SEGMENT_MS_CONFIG, "21600000");
        config.put(TopicConfig.MIN_COMPACTION_LAG_MS_CONFIG, "3600000");
        config.put(TopicConfig.MAX_MESSAGE_BYTES_CONFIG, "10485760");

        return TopicBuilder.name("topic-request-wallet")
                .partitions(6)
                .replicas(1)
                .configs(config)
                .build();
    }

    @Bean
    public NewTopic generateTopicResponseWallet() {

        Map<String, String> config = new HashMap<>();
        config.put(TopicConfig.CLEANUP_POLICY_CONFIG, TopicConfig.CLEANUP_POLICY_COMPACT);
        config.put(TopicConfig.RETENTION_MS_CONFIG, "21600000");
        config.put(TopicConfig.SEGMENT_MS_CONFIG, "21600000");
        config.put(TopicConfig.MIN_COMPACTION_LAG_MS_CONFIG, "3600000");
        config.put(TopicConfig.MAX_MESSAGE_BYTES_CONFIG, "10485760");

        return TopicBuilder.name("topic-response-wallet")
                .partitions(6)
                .replicas(1)
                .configs(config)
                .build();
    }

    @Bean
    public NewTopic generateTopicRequestRegisterPaymentWithWallet() {

        Map<String, String> config = new HashMap<>();
        config.put(TopicConfig.CLEANUP_POLICY_CONFIG, TopicConfig.CLEANUP_POLICY_COMPACT);
        config.put(TopicConfig.RETENTION_MS_CONFIG, "21600000");
        config.put(TopicConfig.SEGMENT_MS_CONFIG, "21600000");
        config.put(TopicConfig.MIN_COMPACTION_LAG_MS_CONFIG, "3600000");
        config.put(TopicConfig.MAX_MESSAGE_BYTES_CONFIG, "10485760");

        return TopicBuilder.name("topic-request-registerpaymentwithwallet")
                .partitions(6)
                .replicas(1)
                .configs(config)
                .build();
    }

    @Bean
    public NewTopic generateTopicResponseRegisterPaymentByWallet() {

        Map<String, String> config = new HashMap<>();
        config.put(TopicConfig.CLEANUP_POLICY_CONFIG, TopicConfig.CLEANUP_POLICY_COMPACT);
        config.put(TopicConfig.RETENTION_MS_CONFIG, "21600000");
        config.put(TopicConfig.SEGMENT_MS_CONFIG, "21600000");
        config.put(TopicConfig.MIN_COMPACTION_LAG_MS_CONFIG, "3600000");
        config.put(TopicConfig.MAX_MESSAGE_BYTES_CONFIG, "10485760");  // 10MB por mensaje

        return TopicBuilder.name("topic-response-registerpaymentwithwallet")
                .partitions(6)
                .replicas(1)
                .configs(config)
                .build();
    }


}
