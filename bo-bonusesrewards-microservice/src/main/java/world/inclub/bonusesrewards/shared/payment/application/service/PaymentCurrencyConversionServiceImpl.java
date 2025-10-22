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
                    BigDecimal convertedAmount;

                    if (fromCurrency == CurrencyType.USD && toCurrency == CurrencyType.PEN) {
                        convertedAmount = amount.multiply(exchangeRate.buyRate());
                    } else {
                        convertedAmount = amount.divide(exchangeRate.sellRate(), 2, RoundingMode.HALF_UP);
                    }
                    return convertedAmount.setScale(2, RoundingMode.HALF_UP);
                });
    }
}
