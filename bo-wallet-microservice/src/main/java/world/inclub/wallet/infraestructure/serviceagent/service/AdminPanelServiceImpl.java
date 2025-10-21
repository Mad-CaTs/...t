package world.inclub.wallet.infraestructure.serviceagent.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.api.dtos.ExchangeRateDTO;
import world.inclub.wallet.api.dtos.period.PeriodResponse;
import world.inclub.wallet.bankAccountWithdrawal.application.dto.UserAdminDTO;
import world.inclub.wallet.infraestructure.serviceagent.dtos.response.BankResponse;
import world.inclub.wallet.infraestructure.serviceagent.dtos.response.CountryResponse;
import world.inclub.wallet.infraestructure.serviceagent.dtos.response.CurrencyResponse;
import world.inclub.wallet.infraestructure.serviceagent.dtos.response.DataResponse;
import world.inclub.wallet.infraestructure.serviceagent.service.interfaces.IAdminPanelService;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminPanelServiceImpl implements IAdminPanelService {

    @Qualifier("adminPanelWebClient")
    private final WebClient adminPanelWebClient;

    // Método genérico para obtener solo el contenido de "data" desde diferentes endpoints
    public <T> Mono<T> getDataContent(String uri, ParameterizedTypeReference<DataResponse<T>> responseType) {
        return adminPanelWebClient.get()
                .uri(uri)
                .retrieve()
                .bodyToMono(responseType)
                .map(DataResponse::getData);  // Extrae solo el contenido de "data"
    }

    @Override
    // Método específico para obtener bancos
    public Mono<List<BankResponse>> getBanks() {
        return getDataContent("/api/bank/", new ParameterizedTypeReference<DataResponse<List<BankResponse>>>() {
        });
    }


    @Override
    // Método específico para obtener monedas
    public Mono<List<CurrencyResponse>> getCurrencies() {
        return getDataContent("/api/currency/", new ParameterizedTypeReference<DataResponse<List<CurrencyResponse>>>() {
        });
    }


    @Override
    public Mono<List<CountryResponse>> getCountrys() {
        return getDataContent("/api/country/", new ParameterizedTypeReference<DataResponse<List<CountryResponse>>>() {
        });
    }
//
    @Override
    public Mono<ExchangeRateDTO> getTypeExchange() {
        return getDataContent("/api/exchangerate/getexchange", new ParameterizedTypeReference<DataResponse<ExchangeRateDTO>>() {
        })
                .flatMap(data -> {
                    if (data == null) {
                        ExchangeRateDTO fallbackRate = new ExchangeRateDTO();
                        fallbackRate.setIdExchangeRate(1);
                        log.warn("Exchange rate data is null, using fallback value.");
                        return Mono.just(fallbackRate);
                    }
                    log.info("Received exchange rate successfully: {}", data);
                    return Mono.just(data);
                })
                .onErrorResume(e -> {
                    log.error("Error obtaining exchange rate data", e);
                    ExchangeRateDTO fallbackRate = new ExchangeRateDTO();
                    fallbackRate.setIdExchangeRate(1);
                    return Mono.just(fallbackRate);
                });
    }

    @Override
    public Mono<List<PeriodResponse>> getPeriodsByIds(List<Integer> ids) {
        String path = "/api/period/ids/" + ids.stream()
                .map(String::valueOf)
                .collect(Collectors.joining(","));
        return getDataContent(path, new ParameterizedTypeReference<DataResponse<List<PeriodResponse>>>() {});
    }

    @Override
    public Mono<UserAdminDTO> getUserByUsername(String username) {
        return adminPanelWebClient.get()
                .uri("/api/v1/users/buscar/usernamev2/{username}", username)
                .retrieve()
                .bodyToMono(UserAdminDTO.class)
                .doOnSuccess(user -> log.info("UsuarioAdmin obtenido: {}", user))
                .doOnError(e -> log.error("Error obteniendo UsuarioAdmin por username", e));
    }

    @Override
    public Mono<UserAdminDTO> getUserById(Integer id) {
        return adminPanelWebClient.get()
                .uri("/api/v1/users/{id}", id)
                .retrieve()
                .bodyToMono(UserAdminDTO.class)
                .doOnSuccess(user -> log.info("UsuarioAdmin obtenido: {}", user))
                .doOnError(e -> log.error("Error obteniendo UsuarioAdmin por username", e));
    }

    //método batch
    public Mono<Map<Integer, UserAdminDTO>> getUsersByIds(List<Integer> ids) {
        if (ids == null || ids.isEmpty()) {
            return Mono.just(Collections.emptyMap());
        }

        return Flux.fromIterable(ids)
                .flatMap(id -> getUserById(id)
                        .map(user -> Map.entry(id, user))
                        .onErrorResume(e -> {
                            log.warn("No se pudo obtener usuario con id {}", id, e);
                            return Mono.empty();
                        })
                )
                .collectMap(Map.Entry::getKey, Map.Entry::getValue);
    }

}
