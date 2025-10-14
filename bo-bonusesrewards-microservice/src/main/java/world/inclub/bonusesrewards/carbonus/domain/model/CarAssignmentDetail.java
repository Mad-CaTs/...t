package world.inclub.bonusesrewards.carbonus.domain.model;

import lombok.Builder;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Builder(toBuilder = true)
public record CarAssignmentDetail(
        UUID carId,
        UUID assignmentId,
        Long memberId,
        CarBrand brand,
        CarModel model,
        String color,
        String imageUrl,
        BigDecimal price,
        BigDecimal interestRate,
        BigDecimal bonusInitial,
        BigDecimal memberInitial,
        Integer initialInstallmentsCount,
        Integer monthlyInstallmentsCount,
        LocalDate paymentStartDate,
        Boolean isAssigned,
        Instant assignedDate
) {}