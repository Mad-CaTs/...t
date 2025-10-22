package world.inclub.bonusesrewards.shared.utils.exchange.infrastructure;

import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Repository;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.infrastructure.webclient.DataResponse;
import world.inclub.bonusesrewards.shared.utils.exchange.domain.ExchangeRate;
import world.inclub.bonusesrewards.shared.utils.exchange.domain.ExchangeRateRepositoryPort;

@Repository
@RequiredArgsConstructor
public class ExchangeRateRepositoryAdapter
        implements ExchangeRateRepositoryPort {

    private final WebClient adminWebClient;

    @Override
    public Mono<ExchangeRate> findLatestExchangeRate() {
        return adminWebClient.get()
                .uri("/api/exchangerate/getexchange")
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<DataResponse<ExchangeRateResponse>>() {})
                .map(DataResponse::data)
                .map(ExchangeRateResponse::toDomain);
    }
}
