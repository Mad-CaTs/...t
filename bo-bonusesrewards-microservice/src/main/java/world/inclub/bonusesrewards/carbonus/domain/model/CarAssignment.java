package world.inclub.bonusesrewards.carbonus.domain.model;

import lombok.Builder;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Domain model representing a car assignment with financial configuration.
 * Contains all the financial details and configuration for a car assigned to a member.
 */
@Builder(toBuilder = true)
public record CarAssignment(
        UUID id,
        UUID carId,
        Long memberId,
        BigDecimal price,
        BigDecimal interestRate,
        UUID rankBonusId,
        BigDecimal memberInitial,
        Integer initialInstallmentsCount,
        Integer monthlyInstallmentsCount,
        LocalDate paymentStartDate,
        Instant assignedDate,
        Boolean isAssigned,
        Instant createdAt,
        Instant updatedAt
) {}