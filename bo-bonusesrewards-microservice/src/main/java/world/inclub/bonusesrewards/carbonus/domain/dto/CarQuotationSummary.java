package world.inclub.bonusesrewards.carbonus.domain.dto;

import lombok.Builder;

import java.util.UUID;

@Builder
public record CarQuotationSummary(
        UUID classificationId,
        Long memberId,
        String username,
        String memberFullName,
        String countryOfResidence,
        Long rankId,
        String rankName,
        String lastQuotationDate,
        Boolean reviewed
) {}
