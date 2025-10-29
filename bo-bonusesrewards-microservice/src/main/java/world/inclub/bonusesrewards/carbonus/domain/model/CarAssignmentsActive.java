package world.inclub.bonusesrewards.carbonus.domain.model;

import lombok.Builder;
import world.inclub.bonusesrewards.shared.rank.domain.model.Rank;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Builder(toBuilder = true)
public record CarAssignmentsActive(
        UUID carAssignmentId,
        Long memberId,
        String memberFullName,
        String username,
        String brandName,
        String modelName,
        BigDecimal priceUsd,
        Integer totalInitialInstallments,
        Long paidInitialInstallments,
        Integer totalMonthlyInstallments,
        Long paidMonthlyInstallments,
        BigDecimal assignedMonthlyBonusUsd,
        BigDecimal monthlyInstallmentUsd,
        Rank rewardedRank,
        Rank currentRank,
        BigDecimal totalGpsUsd,
        BigDecimal totalInsuranceUsd,
        BigDecimal totalMandatoryInsuranceAmount,
        Instant assignedDate
) {}