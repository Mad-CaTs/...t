package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.model.CarAssignmentsActive;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarAssignmentsActiveViewEntity;
import world.inclub.bonusesrewards.shared.rank.domain.model.MemberRankDetail;
import world.inclub.bonusesrewards.shared.rank.domain.model.Rank;

@Component
public class CarAssignmentsActiveMapper {

    public CarAssignmentsActive toDomain(CarAssignmentsActiveViewEntity entity, MemberRankDetail memberRankDetail) {
        if (entity == null) return null;

        return CarAssignmentsActive.builder()
                .carAssignmentId(entity.getCarAssignmentId())
                .memberId(entity.getMemberId())
                .memberFullName(entity.getMemberFullName())
                .username(entity.getUsername())
                .brandName(entity.getBrandName())
                .modelName(entity.getModelName())
                .priceUsd(entity.getPriceUsd())
                .totalInitialInstallments(entity.getTotalInitialInstallments())
                .paidInitialInstallments(entity.getPaidInitialInstallments())
                .totalMonthlyInstallments(entity.getTotalMonthlyInstallments())
                .paidMonthlyInstallments(entity.getPaidMonthlyInstallments())
                .assignedMonthlyBonusUsd(entity.getAssignedMonthlyBonusUsd())
                .monthlyInstallmentUsd(entity.getMonthlyInstallmentUsd())
                .currentRank(mapToRank(memberRankDetail))
                .assignedDate(entity.getAssignedDate())
                .build();
    }

    private Rank mapToRank(MemberRankDetail memberRankDetail) {
        if (memberRankDetail == null) return null;

        return Rank.builder()
                .id(memberRankDetail.rankId())
                .name(memberRankDetail.rankName())
                .build();
    }

}