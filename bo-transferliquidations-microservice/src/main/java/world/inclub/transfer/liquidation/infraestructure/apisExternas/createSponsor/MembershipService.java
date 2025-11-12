package world.inclub.transfer.liquidation.infraestructure.apisExternas.createSponsor;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.infraestructure.apisExternas.exception.core.ExternalApiException;

import java.util.Map;
import world.inclub.transfer.liquidation.infraestructure.apisExternas.createSponsor.request.CreateMembershipRequest;

@Service("infraMembershipService")
@Slf4j
public class MembershipService {

    private final WebClient webClient;

    public MembershipService(@Qualifier("membershipWebClient") WebClient webClient) {
        this.webClient = webClient;
    }

    public Mono<Map<String, Object>> createMembership(CreateMembershipRequest request) {
        return webClient.post()
                .uri("/membership")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(request)
                .retrieve()
                .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(), clientResponse ->
                        clientResponse.bodyToMono(String.class).flatMap(errorBody -> {
                            String msg = String.format("Error en MembershipService POST /api/v1/membership: status=%s body=%s", clientResponse.statusCode(), errorBody);
                            log.error(msg);
                            return Mono.error(new ExternalApiException(msg));
                        }))
                .bodyToMono(String.class)
                .flatMap(raw -> {
                    try {
                        ObjectMapper mapper = new ObjectMapper();
                        Map<String, Object> resp = mapper.readValue(raw, new TypeReference<Map<String, Object>>(){});
                        Object dataObj = resp.getOrDefault("data", resp);
                        Map<String, Object> data = mapper.convertValue(dataObj, new TypeReference<Map<String, Object>>(){});
                        return Mono.just(data);
                    } catch (Exception e) {
                        log.error("Error parseando respuesta MembershipService: {}", raw, e);
                        return Mono.error(new ExternalApiException("No se pudo parsear respuesta remota", e));
                    }
                });
    }

}
