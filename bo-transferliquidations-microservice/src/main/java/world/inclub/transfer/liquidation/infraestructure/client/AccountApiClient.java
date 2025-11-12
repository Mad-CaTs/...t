package world.inclub.transfer.liquidation.infraestructure.client;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.http.MediaType;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;
import world.inclub.transfer.liquidation.api.dtos.RegisterTransferRequest;

import java.time.Duration;

@Component
public class AccountApiClient {

    private static final Logger log = LoggerFactory.getLogger(AccountApiClient.class);
    private final WebClient localAccountWebClient;
    private final ObjectMapper mapper = new ObjectMapper();

    public AccountApiClient(WebClient localAccountWebClient) {
        this.localAccountWebClient = localAccountWebClient;
    }

    public Mono<String> registerTransfer(RegisterTransferRequest request) {
        return registerTransfer(request, null);
    }

    public Mono<String> registerTransfer(RegisterTransferRequest request, String authorizationHeader) {
        Mono<String> payloadMono = Mono.fromCallable(() -> mapper.writeValueAsString(request))
            .doOnSuccess(payload -> log.info("AccountApiClient.registerTransfer: outgoing payload={}", payload))
            .doOnError(e -> log.warn("AccountApiClient: could not serialize request for logging: {}", e.getMessage()));

        return payloadMono.flatMap(payload -> {
            WebClient.RequestHeadersSpec<?> headersSpec = localAccountWebClient.post()
                .uri(uriBuilder -> uriBuilder.path("/register/transfer").queryParam("registrationType", 1).build())
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON);

            if (authorizationHeader != null && !authorizationHeader.isBlank()) {
                headersSpec = headersSpec.headers(h -> h.set(org.springframework.http.HttpHeaders.AUTHORIZATION, authorizationHeader));
            }

            WebClient.RequestBodySpec bodySpec = (WebClient.RequestBodySpec) headersSpec;

            return bodySpec.bodyValue(request)
                .retrieve()
                .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(), resp -> 
                    resp.bodyToMono(String.class).flatMap(body -> {
                        log.error("Account service returned error status {} with body={}", resp.statusCode(), body);
                        return Mono.error(new RuntimeException("Account service error: " + body));
                    }))
                .bodyToMono(String.class)
                .retryWhen(Retry.backoff(2, Duration.ofMillis(200)).filter(throwable -> {
                    String msg = throwable.getMessage() == null ? "" : throwable.getMessage().toLowerCase();
                    return msg.contains("i/o error") || msg.contains("connection") || msg.contains("timed out") || msg.contains("timeout");
                }))
                .doOnError(err -> log.error("AccountApiClient.registerTransfer failed: {}", err.getMessage()));
        });
    }
}
