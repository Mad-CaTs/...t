package world.inclub.transfer.liquidation.infraestructure.apisExternas.transfer;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.infraestructure.apisExternas.account.dtos.UserAccountResponse;
import world.inclub.transfer.liquidation.infraestructure.apisExternas.exception.core.ExternalApiException;
import world.inclub.transfer.liquidation.infraestructure.apisExternas.transfer.request.EditUserRequest;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class TransferService {

    private final WebClient transferWebClient; // Bean configurado en WebClientConfig

    /**
     * Llama al endpoint remoto /api/user/edit/{username} directamente con EditUserRequest.
     * Ahora recibe `username` por separado porque `EditUserRequest` no contiene ese campo.
     */
    public Mono<UserAccountResponse> editUser(String username, EditUserRequest request) {
        if (username == null || username.isBlank()) {
            return Mono.error(new IllegalArgumentException("Username es requerido"));
        }

        log.info("[TransferService] PUT /api/user/edit/{} payload: {}", username, request);

        return transferWebClient.put()
                .uri("/api/user/edit/{username}", username)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(Map.of(
                        "username", username,
                        "transferType", 1,
                        "userCustomer", request
                ))
                .retrieve()
                .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                        clientResponse -> clientResponse.bodyToMono(String.class)
                                .flatMap(error -> {
                                    String msg = String.format(
                                            "Error remoto editUser: status=%s body=%s",
                                            clientResponse.statusCode(), error);
                                    log.error(msg);
                                    return Mono.error(new ExternalApiException(msg));
                                }))
                .bodyToMono(String.class)
                .flatMap(this::parseUserAccountResponse);
    }

    private Mono<UserAccountResponse> parseUserAccountResponse(String raw) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> resp = mapper.readValue(raw, new TypeReference<Map<String, Object>>() {});
            Object data = resp.getOrDefault("data", resp);
            UserAccountResponse parsed = mapper.convertValue(data, UserAccountResponse.class);
            return Mono.just(parsed);
        } catch (Exception e) {
            log.error("Error parseando respuesta editUser: {}", raw, e);
            return Mono.error(new ExternalApiException("No se pudo parsear respuesta remota", e));
        }
    }
}
