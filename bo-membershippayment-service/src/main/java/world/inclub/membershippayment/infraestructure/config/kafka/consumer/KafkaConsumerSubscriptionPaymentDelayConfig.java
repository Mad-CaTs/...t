package world.inclub.membershippayment.infraestructure.config.kafka.consumer;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import world.inclub.membershippayment.domain.dto.request.SubscriptionDelayRequest;
import world.inclub.membershippayment.infraestructure.config.kafka.constants.KafkaConstants;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaConsumerSubscriptionPaymentDelayConfig {
    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Bean
    public ConsumerFactory<String, SubscriptionDelayRequest> subscriptionDelayRequestConsumerFactory() {
        Map<String, Object> configProps = new HashMap<>();
        configProps.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        configProps.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        configProps.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        configProps.put(ConsumerConfig.GROUP_ID_CONFIG, KafkaConstants.GROUP_ID);
        configProps.put(JsonDeserializer.TRUSTED_PACKAGES, "*");
        configProps.put(JsonDeserializer.VALUE_DEFAULT_TYPE, SubscriptionDelayRequest.class.getName());
        return new DefaultKafkaConsumerFactory<>(configProps, new StringDeserializer(),
                new JsonDeserializer<>(SubscriptionDelayRequest.class, false));
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, SubscriptionDelayRequest> subscriptionDelayRequestKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, SubscriptionDelayRequest> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(subscriptionDelayRequestConsumerFactory());
        return factory;
    }
}
