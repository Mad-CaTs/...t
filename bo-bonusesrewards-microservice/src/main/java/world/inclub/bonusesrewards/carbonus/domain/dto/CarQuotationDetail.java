package world.inclub.bonusesrewards.carbonus.domain.dto;

import lombok.Builder;

import java.math.BigDecimal;
import java.util.UUID;

@Builder
public record CarQuotationDetail(
        UUID id,
        UUID classificationId,
        Long memberId,
        String username,
        String memberName,
        String brand,
        String model,
        String color,
        BigDecimal price,
        String dealership,
        Long executiveCountryId,
        String salesExecutive,
        String prefixPhone,
        String salesExecutivePhone,
        String quotationUrl,
        Integer initialInstallments,
        Long eventId,
        String eventName,
        Boolean isAccepted,
        String acceptedAt
) {}
