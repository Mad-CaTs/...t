package world.inclub.wallet.infraestructure.serviceagent.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.hc.core5.http.HttpStatus;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.api.dtos.response.PaymentDueItem;
import world.inclub.wallet.infraestructure.serviceagent.dtos.response.PaymentResponse;

import java.time.Duration;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class MembershipPayment {

    @Qualifier("membershipPaymentWebClient")
    private final WebClient membershipPaymentWebClient;



    public Flux<PaymentResponse> getAllPaymentDoue(){

        return membershipPaymentWebClient
                .get()
                .uri("/api/v1/pay/payments/due-today")
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, response ->
                        response.bodyToMono(String.class)
                                .defaultIfEmpty("Error de cliente desconocido")
                                .flatMap(errorBody -> Mono.error(new RuntimeException("Error de cliente: " + response.statusCode() + " - " + errorBody)))
                )
                .onStatus(HttpStatusCode::is5xxServerError, response ->
                        response.bodyToMono(String.class)
                                .defaultIfEmpty("Error de servidor desconocido")
                                .flatMap(errorBody -> Mono.error(new RuntimeException("Error de servidor: " + response.statusCode() + " - " + errorBody)))
                )
                .bodyToFlux(PaymentResponse.class)
                .timeout(Duration.ofSeconds(30))
                .retryWhen(reactor.util.retry.Retry.backoff(3, Duration.ofSeconds(2))
                    .filter(e -> !(e instanceof RuntimeException)))
                .onErrorResume(e -> {
                    // Aquí puedes loguear el error si lo deseas
                    return Flux.empty();
                });

    }

    public Mono<String> sendPaymentDueList(List<PaymentDueItem> paymentDueItems){
        return membershipPaymentWebClient
                .post()
                .uri("")
                .body(Mono.just(paymentDueItems), new ParameterizedTypeReference<List<PaymentDueItem>>() {})
                .retrieve()
                .onStatus(HttpStatusCode::isError, response -> {
                    log.error("Error al enviar datos al microservicio: {}", response.statusCode());
                    return Mono.error(new RuntimeException("Error al enviar datos al microservicio: " + response.statusCode()));
                })
                .bodyToMono(String.class)
                .doOnSuccess(response -> log.info("Datos enviados exitosamente: {}", response))
                .doOnError(error -> log.error("Error al enviar datos: {}", error.getMessage()));
    }
}
