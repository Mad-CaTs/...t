package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.response;

import lombok.Builder;

import java.math.BigDecimal;
import java.util.UUID;

@Builder(toBuilder = true)
public record CarAssignmentDetailsResponse(
        UUID carAssignmentId,
        Long memberId,
        CarBrandResponse brand,
        CarModelResponse model,
        String color,
        String imageUrl,
        BigDecimal price,
        BigDecimal interestRate,
        BigDecimal companyInitial,
        BigDecimal memberInitial,
        Integer initialInstallmentsCount,
        Integer monthlyInstallmentsCount,
        String paymentStartDate,
        Boolean isAssigned,
        String assignedDate
) {}