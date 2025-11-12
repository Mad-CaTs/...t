package world.inclub.transfer.liquidation.infraestructure.config.kafka.consumer;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import world.inclub.transfer.liquidation.api.dtos.StateLiquidationDTO;
import world.inclub.transfer.liquidation.infraestructure.kafka.constant.KafkaConstans;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaConsumerCreateLiquidationRequestConfig {

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Bean
    public ConsumerFactory<String, StateLiquidationDTO> createLiquidationConsumerFactory() {
        Map<String, Object> configProps = new HashMap<>();
        configProps.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        configProps.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        configProps.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        configProps.put(ConsumerConfig.GROUP_ID_CONFIG, KafkaConstans.GROUP_ID);
        configProps.put(JsonDeserializer.TRUSTED_PACKAGES, "*");
        return new DefaultKafkaConsumerFactory<>(configProps, new StringDeserializer(),
                new JsonDeserializer<>(StateLiquidationDTO.class, false));
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, StateLiquidationDTO> createLiquidationKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, StateLiquidationDTO> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(createLiquidationConsumerFactory());
        return factory;
    }

}

