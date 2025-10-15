package world.inclub.bonusesrewards.carbonus.domain.model;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

import lombok.Builder;

/*
 * CarPaymentSchedule represents the payment schedule for a car assignment.
 * It includes details about each installment, such as amounts for financing,
 */
@Builder(toBuilder = true)
public record CarPaymentSchedule(
        UUID id,
        UUID carAssignmentId,
        Integer orderNum,
        Integer installmentNum,
        Boolean isInitial,
        BigDecimal financingInstallment,
        BigDecimal insurance,
        BigDecimal initialInstallment,
        BigDecimal initialBonus,
        BigDecimal gps,
        BigDecimal monthlyBonus,
        BigDecimal memberAssumedPayment,
        BigDecimal total,
        LocalDate dueDate,
        Long statusId,
        Instant paymentDate,
        Instant createdAt,
        Instant updatedAt
) {}
