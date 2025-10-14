package world.inclub.bonusesrewards.carbonus.domain.factory;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.model.Car;
import world.inclub.bonusesrewards.carbonus.domain.model.CarAssignment;
import world.inclub.bonusesrewards.carbonus.domain.model.CarRankBonus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Component
public class CarAssignmentFactory {

    /**
     * Prepares a car assignment for save
     */
    public CarAssignment prepareForSave(
            CarAssignment carAssignment,
            Car car,
            CarRankBonus rankBonus
    ) {
        return CarAssignment.builder()
                .carId(car.id())
                .memberId(getMemberIdOrNull(carAssignment))
                .price(carAssignment.price())
                .interestRate(carAssignment.interestRate())
                .rankBonusId(getRankBonusId(rankBonus))
                .memberInitial(getMemberInitialOrNull(carAssignment, rankBonus))
                .initialInstallmentsCount(carAssignment.initialInstallmentsCount())
                .monthlyInstallmentsCount(carAssignment.monthlyInstallmentsCount())
                .paymentStartDate(carAssignment.paymentStartDate())
                .assignedDate(getAssignedDate(carAssignment.memberId(), carAssignment.assignedDate()))
                .isAssigned(getStatus(carAssignment.memberId()))
                .build();
    }

    /**
     * Prepares a car assignment for update
     */
    public CarAssignment prepareForUpdate(
            CarAssignment carAssignment,
            CarAssignment existingAssignment,
            CarRankBonus rankBonus
    ) {
        return existingAssignment.toBuilder()
                .memberId(getMemberIdOrNull(carAssignment))
                .price(carAssignment.price())
                .interestRate(carAssignment.interestRate())
                .rankBonusId(getRankBonusId(rankBonus))
                .memberInitial(getMemberInitialOrNull(carAssignment, rankBonus))
                .initialInstallmentsCount(carAssignment.initialInstallmentsCount())
                .monthlyInstallmentsCount(carAssignment.monthlyInstallmentsCount())
                .paymentStartDate(carAssignment.paymentStartDate())
                .assignedDate(getAssignedDate(carAssignment.memberId(), existingAssignment.assignedDate()))
                .isAssigned(getStatus(carAssignment.memberId()))
                .build();
    }

    private BigDecimal getMemberInitialOrNull(CarAssignment carAssignment, CarRankBonus carRankBonus) {
        if (carRankBonus == null) return null;
        BigDecimal carPrice = carAssignment.price();
        BigDecimal bonusPrice = carRankBonus.bonusPrice();
        BigDecimal result = carPrice.subtract(bonusPrice);
        return result.compareTo(BigDecimal.ZERO) < 0 ? null : result;
    }

    private Long getMemberIdOrNull(CarAssignment carAssignment) {
        return carAssignment.memberId() != null && carAssignment.memberId() > 0 ? carAssignment.memberId() : null;
    }

    private Boolean getStatus(Long memberId) {
        return memberId != null;
    }

    private Instant getAssignedDate(Long memberId, Instant existingAssignedDate) {
        return memberId != null ? Instant.now() : existingAssignedDate;
    }

    private UUID getRankBonusId(CarRankBonus rankBonus) {
        return rankBonus != null ? rankBonus.id() : null;
    }

}