package world.inclub.membershippayment.infraestructure.apisExternas.account;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.aplication.service.mapper.AccountToNotificationMapper;
import world.inclub.membershippayment.crosscutting.exception.core.ExternalApiException;
import world.inclub.membershippayment.crosscutting.utils.ConstantFields;
import world.inclub.membershippayment.domain.dto.request.UserDTO;
import world.inclub.membershippayment.infraestructure.apisExternas.account.dtos.UserAccountRegistrationResponse;
import world.inclub.membershippayment.infraestructure.apisExternas.account.dtos.UserAccountResponse;
import world.inclub.membershippayment.domain.dto.request.SuscriptionRequest;
import world.inclub.membershippayment.domain.dto.response.SponsordResponse;
import world.inclub.membershippayment.domain.entity.User;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.DataResponse;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AccountService {

    @Qualifier("accountWebClient")
    private final WebClient accountWebClient;

    private  <T> Mono<T> getDataContent(String uri, ParameterizedTypeReference<DataResponse<T>> responseType) {
        log.info("Llamando a AdminPAnel");
        log.info("URI for external call: {}", uri);

        return accountWebClient.get()
                .uri(uri)
                .retrieve()
                .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(), clientResponse ->
                        clientResponse.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("Error calling external API: Status Code: {}, Body: {}",
                                            clientResponse.statusCode(),
                                            errorBody);
                                    return Mono.error(new ExternalApiException("External API error: " + errorBody));
                                })
                )
                .bodyToMono(responseType)
                .map(DataResponse::getData); // Extrae solo el contenido de "data"
    }

    public Mono<UserAccountResponse> getUserAccountById(Integer idUserSponsor) {
        String apiUrl = "/" + idUserSponsor.toString();

        return getDataContent(apiUrl, new ParameterizedTypeReference<DataResponse<UserAccountResponse>>() {});
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

        if (request.getTypeUser().equals(ConstantFields.RegisterType.MULTI_ACCOUNT)) {
    
            String apiUrl = "/multi-account/register";
            Map<String, Integer> body = new HashMap<>();
            body.put("parentId", request.getIdSponsor());

            // Esto es para darle el status al usuario, si es que lo tiene
            if(request.getUser() != null && request.getUser().getIdState() != null) {
                body.put("status", request.getUser().getIdState());
            }
    
            return accountWebClient.post()
                    .uri(apiUrl)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(body)
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(), clientResponse -> {
                        return clientResponse.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("Error en la API externa (Multi-Account): Status Code: {}, Body: {}",
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
    
        } else {
            return Mono.error(new ExternalApiException("Invalid type user"));
        }
    }

    /**
     * Este método se encarga de obtener el patrocinador del usuario.
     *
     * @param idUserSponsor El ID del patrocinador del usuario.
     * @return Un Mono<SponsordResponse> que contiene la información del patrocinador del usuario.
     */
    public Mono<SponsordResponse> getUserSponsor(Integer idUserSponsor) {
        return getUserAccountById(idUserSponsor)
                .map(userAccount -> AccountToNotificationMapper.mapToSponsordResponse(userAccount));
    }

    public Mono<String> getDniByUserId(Integer userId) {
        return getUserAccountById(userId)
                .map(userAccountResponse -> userAccountResponse.nroDocument);
    }
    public Mono<UserAccountResponse> getUserById(Integer idUser) {
        return getUserAccountById(idUser);
    }
    

}
