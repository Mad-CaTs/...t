package world.inclub.transfer.liquidation.infraestructure.apisExternas.jobstatus;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.HashMap;

@Service("jobStatusService")
@Slf4j
public class JobStatusService {

    private final WebClient webClient;

    public JobStatusService(@Qualifier("jobStatusWebClient") WebClient webClient) {
        this.webClient = webClient;
    }

    /**
     * Calls POST /liquidation/reactivatePostLiquidation with body { idSponsor, idUser }
     */
    public Mono<Void> reactivatePostLiquidation(Integer idSponsor, Integer idUser) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("idSponsor", idSponsor);
        payload.put("idUser", idUser);

        return webClient.post()
                .uri(uriBuilder -> uriBuilder.path("/liquidation/reactivatePostLiquidation").build())
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(payload)
                .retrieve()
                .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(), resp ->
                        resp.bodyToMono(String.class).flatMap(body -> {
                            String msg = String.format("JobStatusService POST /liquidation/reactivatePostLiquidation failed: status=%s body=%s", resp.statusCode(), body);
                            log.error(msg);
                            return Mono.error(new RuntimeException(msg));
                        }))
                .bodyToMono(Void.class)
                .doOnSuccess(v -> log.info("reactivatePostLiquidation called for sponsor={} user={}", idSponsor, idUser));
    }
}
