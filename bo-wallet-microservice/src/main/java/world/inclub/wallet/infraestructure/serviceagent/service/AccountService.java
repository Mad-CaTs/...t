package world.inclub.wallet.infraestructure.serviceagent.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import world.inclub.wallet.infraestructure.exception.core.ExternalApiException;
import world.inclub.wallet.infraestructure.serviceagent.dtos.AccountBankRequestDTO;
import world.inclub.wallet.infraestructure.serviceagent.dtos.UserAccountResponse;
import world.inclub.wallet.infraestructure.serviceagent.dtos.response.AccountBankByClientResponse;
import world.inclub.wallet.infraestructure.serviceagent.dtos.response.AccountBankResponse;
import world.inclub.wallet.infraestructure.serviceagent.dtos.response.DataResponse;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AccountService {

    @Qualifier("accountWebClient")
    private final WebClient accountWebClient;

    private <T> Mono<T> getDataContent(String uri, ParameterizedTypeReference<DataResponse<T>> responseType) {
        log.info("Llamando a AdminPanel");
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
                .map(DataResponse::getData);
    }

    public Mono<UserAccountResponse> getUserAccountById(Integer idUserSponsor) {
        String apiUrl = "/api/v1/account/" + idUserSponsor.toString();
        return getDataContent(apiUrl, new ParameterizedTypeReference<DataResponse<UserAccountResponse>>() {});
    }

    public Mono<AccountBankResponse> getIdAccountBank(Long idAccountBank) {
        String apiUrl = "/api/v1/accountbank/listId/" + idAccountBank;
        return getDataContent(apiUrl, new ParameterizedTypeReference<DataResponse<AccountBankResponse>>() {});
    }

    public Mono<List<AccountBankByClientResponse>> searchAccountBankList(AccountBankRequestDTO request) {
        String apiUrl = "/api/v1/accountbank/searchv1";
        log.info("Searching account banks with {} filters", request.getFilters().size());

        return accountWebClient.post()
                .uri(apiUrl)
                .bodyValue(request)
                .retrieve()
                .onStatus(HttpStatusCode::isError, clientResponse ->
                        clientResponse.bodyToMono(String.class)
                                .doOnNext(errorBody -> log.error("Error calling searchv1: Status {}, Body: {}", clientResponse.statusCode(), errorBody))
                                .flatMap(errorBody -> Mono.error(new ExternalApiException("External API error: " + errorBody)))
                )
                .bodyToMono(new ParameterizedTypeReference<List<AccountBankByClientResponse>>() {})
                .doOnSuccess(list -> log.info("API retornó {} cuentas", list != null ? list.size() : 0))
                .doOnError(error -> log.error("Fallo en searchAccountBankList: {}", error.getMessage()));
    }
}