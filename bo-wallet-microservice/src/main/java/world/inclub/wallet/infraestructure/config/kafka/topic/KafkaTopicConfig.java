package world.inclub.wallet.infraestructure.config.kafka.topic;

import java.util.HashMap;
import java.util.Map;

import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.common.config.TopicConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;
import world.inclub.wallet.infraestructure.kafka.constant.KafkaConstants;

@Configuration
public class KafkaTopicConfig {

    @Bean
    public NewTopic generateTopicCreateWallet() {

        Map<String, String> config = new HashMap<>();
        config.put(TopicConfig.CLEANUP_POLICY_CONFIG, TopicConfig.CLEANUP_POLICY_COMPACT);
        config.put(TopicConfig.RETENTION_MS_CONFIG, "172800000");
        config.put(TopicConfig.SEGMENT_MS_CONFIG, "604800000");
        config.put(TopicConfig.MIN_COMPACTION_LAG_MS_CONFIG, "86400000");

        return TopicBuilder.name("topic-create-wallet")
                .partitions(1)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic generateTopicRequestUser() {

        Map<String, String> config = new HashMap<>();
        config.put(TopicConfig.CLEANUP_POLICY_CONFIG, TopicConfig.CLEANUP_POLICY_COMPACT);
        config.put(TopicConfig.RETENTION_MS_CONFIG, "21600000");
        config.put(TopicConfig.SEGMENT_MS_CONFIG, "21600000");
        config.put(TopicConfig.MIN_COMPACTION_LAG_MS_CONFIG, "3600000");
        config.put(TopicConfig.MAX_MESSAGE_BYTES_CONFIG, "10485760");

        return TopicBuilder.name("topic-request-useraccount")
                .partitions(6)
                .replicas(1)
                .configs(config)
                .build();
    }

    @Bean
    public NewTopic generateTopicResponseUser() {

        Map<String, String> config = new HashMap<>();
        config.put(TopicConfig.CLEANUP_POLICY_CONFIG, TopicConfig.CLEANUP_POLICY_COMPACT);
        config.put(TopicConfig.RETENTION_MS_CONFIG, "21600000");
        config.put(TopicConfig.SEGMENT_MS_CONFIG, "21600000");
        config.put(TopicConfig.MIN_COMPACTION_LAG_MS_CONFIG, "3600000");
        config.put(TopicConfig.MAX_MESSAGE_BYTES_CONFIG, "10485760");


        return TopicBuilder.name("topic-response-useraccount")
                .partitions(6)
                .replicas(1)
                .configs(config)
                .build();
    }

    @Bean
    public NewTopic generateTopicResponseUser1() {

        Map<String, String> config = new HashMap<>();
        config.put(TopicConfig.CLEANUP_POLICY_CONFIG, TopicConfig.CLEANUP_POLICY_COMPACT);
        config.put(TopicConfig.RETENTION_MS_CONFIG, "172800000");
        config.put(TopicConfig.SEGMENT_MS_CONFIG, "604800000");
        config.put(TopicConfig.MIN_COMPACTION_LAG_MS_CONFIG, "86400000");

        return TopicBuilder.name("topic-dashboard-points")
                .partitions(6)
                .replicas(1)
                .configs(config)
                .build();
    }

    @Bean
    public NewTopic generateTopicResponseUser2() {

        Map<String, String> config = new HashMap<>();
        config.put(TopicConfig.CLEANUP_POLICY_CONFIG, TopicConfig.CLEANUP_POLICY_COMPACT);
        config.put(TopicConfig.RETENTION_MS_CONFIG, "172800000");
        config.put(TopicConfig.SEGMENT_MS_CONFIG, "604800000");
        config.put(TopicConfig.MIN_COMPACTION_LAG_MS_CONFIG, "86400000");

        return TopicBuilder.name("topic-dashboard-three")
                .partitions(1)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic generateTopicResponseUser3() {

        Map<String, String> config = new HashMap<>();
        config.put(TopicConfig.CLEANUP_POLICY_CONFIG, TopicConfig.CLEANUP_POLICY_COMPACT);
        config.put(TopicConfig.RETENTION_MS_CONFIG, "172800000");
        config.put(TopicConfig.SEGMENT_MS_CONFIG, "604800000");
        config.put(TopicConfig.MIN_COMPACTION_LAG_MS_CONFIG, "86400000");

        return TopicBuilder.name("topic-dashboard-ranges")
                .partitions(1)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic generateTopic2() {

        Map<String, String> config = new HashMap<>();
        config.put(TopicConfig.CLEANUP_POLICY_CONFIG, TopicConfig.CLEANUP_POLICY_COMPACT);
        config.put(TopicConfig.RETENTION_MS_CONFIG, "172800000");
        config.put(TopicConfig.SEGMENT_MS_CONFIG, "604800000");
        config.put(TopicConfig.MIN_COMPACTION_LAG_MS_CONFIG, "86400000");

        return TopicBuilder.name(KafkaConstants.Topic.RESPONSE_OPERATION_WALLET)
                .partitions(1)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic generateTopic3() {

        Map<String, String> config = new HashMap<>();
        config.put(TopicConfig.CLEANUP_POLICY_CONFIG, TopicConfig.CLEANUP_POLICY_COMPACT);
        config.put(TopicConfig.RETENTION_MS_CONFIG, "172800000");
        config.put(TopicConfig.SEGMENT_MS_CONFIG, "604800000");
        config.put(TopicConfig.MIN_COMPACTION_LAG_MS_CONFIG, "86400000");

        return TopicBuilder.name(KafkaConstants.Topic.REQUEST_OPERATION_WALLET)
                .partitions(1)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic generateTopic4() {

        Map<String, String> config = new HashMap<>();
        config.put(TopicConfig.CLEANUP_POLICY_CONFIG, TopicConfig.CLEANUP_POLICY_COMPACT);
        config.put(TopicConfig.RETENTION_MS_CONFIG, "172800000");
        config.put(TopicConfig.SEGMENT_MS_CONFIG, "604800000");
        config.put(TopicConfig.MIN_COMPACTION_LAG_MS_CONFIG, "86400000");

        return TopicBuilder.name(KafkaConstants.Topic.ERROR_PAY)
                .partitions(1)
                .replicas(1)
                .build();
    }

}
