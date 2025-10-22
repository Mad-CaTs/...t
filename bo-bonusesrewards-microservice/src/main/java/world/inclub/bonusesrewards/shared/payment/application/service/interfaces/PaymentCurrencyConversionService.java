package world.inclub.bonusesrewards.shared.payment.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.payment.domain.model.CurrencyType;

import java.math.BigDecimal;

public interface PaymentCurrencyConversionService {

    Mono<BigDecimal> convertToTargetCurrency(BigDecimal amount, CurrencyType fromCurrency, CurrencyType toCurrency);
}
