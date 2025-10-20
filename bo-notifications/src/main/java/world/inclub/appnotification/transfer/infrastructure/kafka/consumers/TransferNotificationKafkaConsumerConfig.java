package world.inclub.appnotification.transfer.infrastructure.kafka.consumers;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.util.backoff.FixedBackOff;
import world.inclub.appnotification.transfer.infrastructure.kafka.payload.ProducerTransferBody;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class TransferNotificationKafkaConsumerConfig {

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Bean
    public ConsumerFactory<String, ProducerTransferBody> transferNotificationConsumerFactory() {
        Map<String, Object> configProps = new HashMap<>();
        configProps.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        configProps.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
    configProps.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        JsonDeserializer<ProducerTransferBody> valueDeserializer = new JsonDeserializer<>(ProducerTransferBody.class, false);
    valueDeserializer.addTrustedPackages("*");
    return new DefaultKafkaConsumerFactory<>(configProps, new StringDeserializer(), valueDeserializer);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, ProducerTransferBody> transferNotificationKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, ProducerTransferBody> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(transferNotificationConsumerFactory());
        DefaultErrorHandler errorHandler = new DefaultErrorHandler((record, ex) -> {
            if (record instanceof ConsumerRecord) {
                ConsumerRecord<?, ?> r = (ConsumerRecord<?, ?>) record;
                System.err.println("Kafka listener error for record key=" + r.key() + " topic=" + r.topic() + " partition=" + r.partition() + " offset=" + r.offset() + ": " + ex.getMessage());
            } else {
                System.err.println("Kafka listener error (non-ConsumerRecord): " + ex.getMessage());
            }
            ex.printStackTrace();
        }, new FixedBackOff(0L, 0L));
        factory.setCommonErrorHandler(errorHandler);
        return factory;
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, String> transferNotificationRawKafkaListenerContainerFactory() {
        Map<String, Object> configProps = new HashMap<>();
        configProps.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        configProps.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        configProps.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);

        DefaultKafkaConsumerFactory<String, String> cf = new DefaultKafkaConsumerFactory<>(configProps, new StringDeserializer(), new StringDeserializer());
        ConcurrentKafkaListenerContainerFactory<String, String> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(cf);
        return factory;
    }
}
