package world.inclub.bonusesrewards.carbonus.domain.dto;

import lombok.Builder;

import java.math.BigDecimal;
import java.util.UUID;

@Builder
public record CarBonusApplicationDetail(
        UUID bonusApplicationId,
        UUID carAssignmentId,
        Long memberId,
        String username,
        String memberFullName,
        BigDecimal bonusAmount,
        BigDecimal discountAmount,
        String description,
        Long paymentTypeId,
        String paymentTypeCode,
        Boolean isInitial,
        String appliedDate
) {}
