package world.inclub.bonusesrewards.shared.utils.exchange.infrastructure;

import com.fasterxml.jackson.annotation.JsonProperty;
import world.inclub.bonusesrewards.shared.utils.exchange.domain.ExchangeRate;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ExchangeRateResponse(
        @JsonProperty("idExchangeRate")
        Long id,

        @JsonProperty("buys")
        BigDecimal buyRate,

        @JsonProperty("sale")
        BigDecimal sellRate,

        @JsonProperty("date")
        LocalDateTime effectiveAt,

        @JsonProperty("modificationDate")
        LocalDateTime updatedAt
) {
    public ExchangeRate toDomain() {
        return new ExchangeRate(
                id,
                buyRate,
                sellRate,
                effectiveAt,
                updatedAt
        );
    }
}
