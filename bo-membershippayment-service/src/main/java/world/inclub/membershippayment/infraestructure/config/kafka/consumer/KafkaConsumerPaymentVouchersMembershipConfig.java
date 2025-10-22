package world.inclub.membershippayment.infraestructure.config.kafka.consumer;

import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import world.inclub.membershippayment.domain.entity.PaymentVoucher;
import world.inclub.membershippayment.infraestructure.config.kafka.constants.KafkaConstants;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Configuration
public class KafkaConsumerPaymentVouchersMembershipConfig {

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Bean
    public ConsumerFactory<String, List<PaymentVoucher>> paymentVouchersMembershipConsumerFactory() {
        Map<String, Object> configProps = new HashMap<>();
        configProps.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        configProps.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        configProps.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        configProps.put(ConsumerConfig.GROUP_ID_CONFIG, KafkaConstants.GROUP_ID);
        configProps.put(JsonDeserializer.TRUSTED_PACKAGES, "*");

        ObjectMapper om = new ObjectMapper();
        om.findAndRegisterModules();
        JavaType type = om.getTypeFactory().constructParametricType(List.class, PaymentVoucher.class);

        return new DefaultKafkaConsumerFactory<>(configProps,new StringDeserializer(), new JsonDeserializer<List<PaymentVoucher>>(type, om, false));
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, List<PaymentVoucher>> paymentVouchersMembershipKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, List<PaymentVoucher>> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(paymentVouchersMembershipConsumerFactory());
        return factory;
    }

}
