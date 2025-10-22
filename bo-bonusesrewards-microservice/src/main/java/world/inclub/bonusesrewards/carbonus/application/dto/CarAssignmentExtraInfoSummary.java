package world.inclub.bonusesrewards.carbonus.application.dto;

import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDate;

@Builder
public record CarAssignmentExtraInfoSummary(
        Long memberId,
        String username,
        String memberFullName,
        Long memberRankId,
        String memberRankName,
        Long eventId,
        String eventName,
        String carBrand,
        String carModel,
        BigDecimal coveredInitialUsd,
        BigDecimal carPriceUsd,
        BigDecimal monthlyBonusUsd,
        Integer totalInitialInstallments,
        Long paidInitialInstallments,
        BigDecimal totalPaidInitialUsd,
        Integer totalMonthlyInstallments,
        Long paidMonthlyInstallments,
        BigDecimal totalPaidMonthlyUsd,
        Long remainingInitialInstallments,
        BigDecimal remainingInitialInstallmentsUsd,
        Long remainingMonthlyInstallments,
        BigDecimal remainingMonthlyInstallmentsUsd,
        BigDecimal totalInitialInstallmentsUsd,
        BigDecimal totalMonthlyInstallmentsUsd,
        LocalDate initialPaymentDate,
        LocalDate lastPaymentDate,
        BigDecimal interestRate
) {}
