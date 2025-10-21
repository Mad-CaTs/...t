package world.inclub.wallet.infraestructure.kafka.utils;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import world.inclub.wallet.infraestructure.kafka.constant.KafkaConstants;


import java.util.List;
import java.util.UUID;
import java.util.concurrent.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaRequestService {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final ConcurrentMap<String, CompletableFuture<Object>> pendingRequests = new ConcurrentHashMap<>();

    public Mono<Object> sendRequest(Object request, String requestTopic, String replyTopic) {
        String correlationId = UUID.randomUUID().toString();
        CompletableFuture<Object> future = new CompletableFuture<>();
        pendingRequests.put(correlationId, future.orTimeout(90, TimeUnit.SECONDS));


        // Construir el mensaje con la cabecera kafka_correlationId
        Message<Object> message = MessageBuilder
                .withPayload(request)
                .setHeader(KafkaHeaders.TOPIC, requestTopic)
                .setHeader(KafkaHeaders.KEY, KafkaConstants.KEY)
                .setHeader(KafkaHeaders.CORRELATION_ID, correlationId)
                .setHeader(KafkaHeaders.REPLY_TOPIC, replyTopic)
                .build();
        kafkaTemplate.send(message);

        log.info("Message sent with correlationId: {}", correlationId);

        return Mono.fromFuture(future)
                .onErrorMap(TimeoutException.class, ex -> {
                    log.error("Se excedio el tiempo de espera para la respuesta de: {}", replyTopic);
                    return ex; // Repropagar la TimeoutException para que la maneje el GlobalExceptionHandler
                });
    }

    // Este metodo se usará en los listeners para completar el future
    public void completeRequest(String correlationId, Object response) {
        CompletableFuture<Object> future = pendingRequests.remove(correlationId);
        if (future != null) {
            future.complete(response);
        } else {
            log.warn("No pending request found for correlationId: {}", correlationId);
        }
    }

}



