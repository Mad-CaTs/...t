package world.inclub.bonusesrewards.shared.utils.exchange.domain;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ExchangeRate(
        Long id,
        BigDecimal buyRate,
        BigDecimal sellRate,
        LocalDateTime effectiveAt,
        LocalDateTime updatedAt
) {}
