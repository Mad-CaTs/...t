package world.inclub.transfer.liquidation.infraestructure.apisExternas.account;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.infraestructure.apisExternas.account.dtos.UserAccountRegistrationResponse;
import world.inclub.transfer.liquidation.infraestructure.apisExternas.account.dtos.UserAccountResponse;
import world.inclub.transfer.liquidation.infraestructure.apisExternas.account.entity.User;
import world.inclub.transfer.liquidation.infraestructure.apisExternas.account.request.SuscriptionRequest;
import world.inclub.transfer.liquidation.infraestructure.apisExternas.exception.core.ExternalApiException;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AccountService {

    @Qualifier("accountWebClient")
    private final WebClient accountWebClient;

    public Mono<UserAccountResponse> getUserAccountByUsername(String user) {
        String apiUrl = "/user/" + user;
        return accountWebClient.get()
                .uri(apiUrl)
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> {
                    ObjectMapper mapper = new ObjectMapper();
                    Map<String, Object> data = (Map<String, Object>) response.get("data");
                    return mapper.convertValue(data, UserAccountResponse.class);
                }).onErrorResume(e -> {
                    log.error("Error obteniendo el patrocinador del usuario", e);
                    return Mono.error(
                            new ExternalApiException("Error obteniendo el patrocinador del usuario: " + e.getMessage(), e));
                });
    }

    public Mono<UserAccountResponse> getUserAccountById(Integer idUserSponsor) {
        String apiUrl = "/" + idUserSponsor.toString();
        return accountWebClient.get()
                .uri(apiUrl)
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> {
                    ObjectMapper mapper = new ObjectMapper();
                    Map<String, Object> data = (Map<String, Object>) response.get("data");
                    return mapper.convertValue(data, UserAccountResponse.class);
                }).onErrorResume(e -> {
                    log.error("Error obteniendo el patrocinador del usuario", e);
                    return Mono.error(
                            new ExternalApiException("Error obteniendo el patrocinador del usuario: " + e.getMessage(), e));
                });
    }

    public Mono<UserAccountResponse> postRegisterUser(SuscriptionRequest request) {

        User userRequest = request.getUser();
        log.info("postUser");

        if (request.getTypeUser() == 1 || request.getTypeUser() == 2) {

            String url = "?registrationType=" + request.getTypeUser();

            return accountWebClient.post()
                    .uri(url)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(userRequest)
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(), clientResponse -> {
                        return clientResponse.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("Error en la API externa (Registro): Status Code: {}, Body: {}",
                                            clientResponse.statusCode(),
                                            errorBody);
                                    return Mono.error(new ExternalApiException("Error en API externa: " + errorBody));
                                });
                    })
                    .bodyToMono(Map.class)
                    .map(response -> {
                        ObjectMapper mapper = new ObjectMapper();
                        Map<String, Object> data = (Map<String, Object>) response.get("data");
                        return mapper.convertValue(data, UserAccountRegistrationResponse.class);
                    })
                    .flatMap(registerResponse -> getUserAccountById(registerResponse.getId().intValue()));
        }
    
        if (request.getTypeUser() == 3) {
    
            String apiUrl = "/sub-profile";
            Map<String, Integer> body = new HashMap<>();
            body.put("userId", request.getIdSponsor());
    
            return accountWebClient.post()
                    .uri(apiUrl)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(body)
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(), clientResponse -> {
                        return clientResponse.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("Error en la API externa (Sub-Profile): Status Code: {}, Body: {}",
                                              clientResponse.statusCode(),
                                              errorBody);
                                    return Mono.error(new ExternalApiException("Error en API externa: " + errorBody));
                                });
                    })
                    .bodyToMono(Map.class)
                    .map(response -> {
                        ObjectMapper mapper = new ObjectMapper();
                        Map<String, Object> data = (Map<String, Object>) response.get("data");
                        return mapper.convertValue(data, UserAccountRegistrationResponse.class);
                    })
                    .flatMap(registerResponse -> getUserAccountById(request.getIdSponsor()));
    
        } else {
            return Mono.error(new ExternalApiException("Invalid type user"));
        }
    }

}
