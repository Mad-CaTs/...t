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
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.StateSuscriptionDto;
import world.inclub.membershippayment.infraestructure.config.kafka.constants.KafkaConstants;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaConsumerStateSuscriptionConfig {

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Bean
    public ConsumerFactory<String, StateSuscriptionDto> stateSuscriptionDtoConsumerFactory() {
        Map<String, Object> configProps = new HashMap<>();
        configProps.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        configProps.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        configProps.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        configProps.put(ConsumerConfig.GROUP_ID_CONFIG, KafkaConstants.GROUP_ID);
        configProps.put(JsonDeserializer.TRUSTED_PACKAGES, "*");
        configProps.put(JsonDeserializer.VALUE_DEFAULT_TYPE, StateSuscriptionDto.class.getName()); // Forzar el tipo a deserializar
        return new DefaultKafkaConsumerFactory<>(configProps, new StringDeserializer(),
                new JsonDeserializer<>(StateSuscriptionDto.class, false));
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, StateSuscriptionDto> stateSuscriptionDtoKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, StateSuscriptionDto> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(stateSuscriptionDtoConsumerFactory());
        // Manejo de errores de deserialización

        return factory;
    }
}
