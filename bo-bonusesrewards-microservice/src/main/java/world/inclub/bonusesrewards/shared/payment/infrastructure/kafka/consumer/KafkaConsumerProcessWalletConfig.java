package world.inclub.bonusesrewards.shared.payment.infrastructure.kafka.consumer;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import world.inclub.bonusesrewards.shared.payment.infrastructure.kafka.constants.KafkaConstants;
import world.inclub.bonusesrewards.shared.payment.infrastructure.kafka.dto.WalletPaymentResponseDto;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaConsumerProcessWalletConfig {

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Bean
    public ConsumerFactory<String, WalletPaymentResponseDto> processWalletPaymentConsumerFactory() {
        Map<String, Object> configProps = new HashMap<>();
        configProps.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        configProps.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        configProps.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        configProps.put(ConsumerConfig.GROUP_ID_CONFIG, KafkaConstants.GROUP_ID);
        configProps.put(JsonDeserializer.TRUSTED_PACKAGES, "*");
        return new DefaultKafkaConsumerFactory<>(configProps, new StringDeserializer(),
                new JsonDeserializer<>(WalletPaymentResponseDto.class, false));
    };

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, WalletPaymentResponseDto> processWalletPaymentKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, WalletPaymentResponseDto> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(processWalletPaymentConsumerFactory());
        return factory;
    }
}
