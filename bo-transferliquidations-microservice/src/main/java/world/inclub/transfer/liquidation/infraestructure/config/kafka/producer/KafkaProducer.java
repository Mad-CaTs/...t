package world.inclub.transfer.liquidation.infraestructure.config.kafka.producer;

import java.util.Map;
import java.util.UUID;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class KafkaProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void sendEmailMessage(String topic, Map<String, Object> payload) {
        try {
            Object keyObj = null;
            if (payload != null) {
                if (payload.get("recipientEmail") != null) {
                    keyObj = payload.get("recipientEmail");
                } else if (payload.get("body") instanceof Map) {
                    Map<?, ?> body = (Map<?, ?>) payload.get("body");
                    if (body.get("transferRequestId") != null) {
                        keyObj = body.get("transferRequestId");
                    }
                }
            }

            String key = (keyObj != null) ? String.valueOf(keyObj) : UUID.randomUUID().toString();

            log.info("KafkaProducer: intentando enviar mensaje al topic {} con key={}", topic, key);
            kafkaTemplate.send(topic, key, payload).whenComplete((result, ex) -> {
                if (ex == null) {
                    log.info("KafkaProducer: mensaje enviado al topic {}", topic);
                } else {
                    log.error("KafkaProducer: fallo al enviar mensaje al topic {}", topic, ex);
                }
            });
        } catch (Exception ex) {
            log.error("KafkaProducer: excepción al enviar mensaje", ex);
        }
    }

    public void sendEmailMessage(String topic, Map<String, Object> payload, String key) {
        try {
            final String sendKey = (key != null && !key.isBlank()) ? key : UUID.randomUUID().toString();
            log.info("KafkaProducer: intentando enviar mensaje al topic {} con key={}", topic, sendKey);
            kafkaTemplate.send(topic, sendKey, payload).whenComplete((result, ex) -> {
                if (ex == null) {
                    log.info("KafkaProducer: mensaje enviado al topic {} con key={}", topic, sendKey);
                } else {
                    log.error("KafkaProducer: fallo al enviar mensaje al topic {} con key={}", topic, sendKey, ex);
                }
            });
        } catch (Exception ex) {
            log.error("KafkaProducer: excepción al enviar mensaje con key", ex);
        }
    }

    // Generic send for any object payload. Key will be a random UUID unless caller provides one.
    public void sendMessage(String topic, Object payload) {
        try {
            String key = UUID.randomUUID().toString();
            log.info("KafkaProducer: intentando enviar mensaje al topic {} con key={}", topic, key);
            kafkaTemplate.send(topic, key, payload).whenComplete((result, ex) -> {
                if (ex == null) {
                    log.info("KafkaProducer: mensaje enviado al topic {}", topic);
                } else {
                    log.error("KafkaProducer: fallo al enviar mensaje al topic {}", topic, ex);
                }
            });
        } catch (Exception ex) {
            log.error("KafkaProducer: excepción al enviar mensaje genérico", ex);
        }
    }

    public void sendMessage(String topic, Object payload, String key) {
        try {
            final String sendKey = (key != null && !key.isBlank()) ? key : UUID.randomUUID().toString();
            log.info("KafkaProducer: intentando enviar mensaje al topic {} con key={}", topic, sendKey);
            kafkaTemplate.send(topic, sendKey, payload).whenComplete((result, ex) -> {
                if (ex == null) {
                    log.info("KafkaProducer: mensaje enviado al topic {} con key={}", topic, sendKey);
                } else {
                    log.error("KafkaProducer: fallo al enviar mensaje al topic {} con key={}", topic, sendKey, ex);
                }
            });
        } catch (Exception ex) {
            log.error("KafkaProducer: excepción al enviar mensaje genérico con key", ex);
        }
    }
}
