package world.inclub.bonusesrewards.carbonus.domain.model;

import lombok.Builder;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Builder(toBuilder = true)
public record CarQuotation(
        UUID id,
        UUID classificationId,
        String brand,
        String model,
        String color,
        BigDecimal price,
        String dealership,
        Long executiveCountryId,
        String salesExecutive,
        String salesExecutivePhone,
        String quotationUrl,
        Long eventId,
        Integer initialInstallments,
        Boolean isAccepted,
        Instant acceptedAt,
        Instant createdAt,
        Instant updatedAt
) {}
