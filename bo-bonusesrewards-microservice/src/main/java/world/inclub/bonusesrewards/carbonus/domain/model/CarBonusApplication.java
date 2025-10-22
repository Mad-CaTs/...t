package world.inclub.bonusesrewards.carbonus.domain.model;

import lombok.Builder;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Builder
public record CarBonusApplication(
        UUID id,
        UUID carAssignmentId,
        Long paymentTypeId,
        BigDecimal bonusAmount,
        BigDecimal discountAmount,
        Boolean isInitial,
        String description,
        Instant appliedDate
) {}
