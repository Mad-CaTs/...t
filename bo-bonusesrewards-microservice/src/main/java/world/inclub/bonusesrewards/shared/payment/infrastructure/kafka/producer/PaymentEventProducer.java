package world.inclub.bonusesrewards.shared.payment.infrastructure.kafka.producer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.payment.infrastructure.kafka.topics.PaymentRejectedEvent;

@Slf4j
@Component
@RequiredArgsConstructor
public class PaymentEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public Mono<SendResult<String, Object>> sendPaymentRejectedEvent(PaymentRejectedEvent event) {
        return Mono.fromFuture(kafkaTemplate.send("topic-payment-rejected", event.getPaymentId().toString(), event))
                .doOnSuccess(result -> log.info("Payment rejected event sent successfully: {}", event.getPaymentId()))
                .doOnError(error -> log.error("Failed to send payment rejected event: {}", error.getMessage()));
    }

}