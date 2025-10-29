package world.inclub.bonusesrewards.shared.payment.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.payment.application.service.interfaces.PaymentCurrencyConversionService;
import world.inclub.bonusesrewards.shared.payment.domain.model.CurrencyType;
import world.inclub.bonusesrewards.shared.utils.exchange.domain.ExchangeRateRepositoryPort;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentCurrencyConversionServiceImpl implements PaymentCurrencyConversionService {

    private final ExchangeRateRepositoryPort exchangeRateRepository;

    @Override
    public Mono<BigDecimal> convertToTargetCurrency(BigDecimal amount, CurrencyType fromCurrency, CurrencyType toCurrency) {

        if (fromCurrency == toCurrency) {
            return Mono.just(amount);
        }

        return exchangeRateRepository.findLatestExchangeRate()
                .map(exchangeRate -> {
                    log.info("Exchange rate - Buy: {}, Sell: {}",
                            exchangeRate.buyRate(), exchangeRate.sellRate());
                    log.info("Converting {} {} a {}", amount, fromCurrency, toCurrency);

                    BigDecimal convertedAmount;

                    if (fromCurrency == CurrencyType.USD && toCurrency == CurrencyType.PEN) {
                        convertedAmount = amount.multiply(exchangeRate.sellRate());
                        log.info("USD → PEN: {} * {} = {}", amount, exchangeRate.sellRate(), convertedAmount);
                    } else {
                        convertedAmount = amount.divide(exchangeRate.buyRate(), 2, RoundingMode.HALF_UP);
                        log.info("PEN → USD: {} / {} = {}", amount, exchangeRate.buyRate(), convertedAmount);
                    }
                    return convertedAmount.setScale(2, RoundingMode.HALF_UP);
                });
    }
}
