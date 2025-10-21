package world.inclub.bonusesrewards.carbonus.domain.dto;

import lombok.Builder;

import java.util.UUID;

@Builder
public record CarQuotationSelected(
        UUID quotationId,
        Long memberId,
        String username,
        String memberFullName,
        String countryOfResidence,
        Long rankId,
        String rankName,
        String acceptedAt,
        String quotationUrl
) {}
