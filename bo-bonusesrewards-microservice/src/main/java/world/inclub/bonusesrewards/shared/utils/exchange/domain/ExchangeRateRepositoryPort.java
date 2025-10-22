package world.inclub.bonusesrewards.shared.utils.exchange.domain;

import reactor.core.publisher.Mono;

public interface ExchangeRateRepositoryPort {
    Mono<ExchangeRate> findLatestExchangeRate();
}
