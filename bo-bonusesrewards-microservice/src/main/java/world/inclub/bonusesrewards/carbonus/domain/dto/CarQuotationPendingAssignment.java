package world.inclub.bonusesrewards.carbonus.domain.dto;

import java.util.UUID;

public record CarQuotationPendingAssignment(
        UUID quotationId,
        String username,
        String memberFullName,
        String rankName
) {}
