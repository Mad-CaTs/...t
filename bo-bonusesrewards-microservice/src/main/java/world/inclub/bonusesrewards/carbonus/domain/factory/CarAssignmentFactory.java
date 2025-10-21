package world.inclub.bonusesrewards.carbonus.domain.factory;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.model.Car;
import world.inclub.bonusesrewards.carbonus.domain.model.CarAssignment;
import world.inclub.bonusesrewards.carbonus.domain.model.CarRankBonus;
import world.inclub.bonusesrewards.shared.bonus.domain.model.Classification;

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
            CarRankBonus rankBonus,
            Classification classification
    ) {
        return CarAssignment.builder()
                .carId(car.id())
                .quotationId(getQuotationIdOrNull(carAssignment))
                .memberId(getMemberIdOrNull(classification))
                .price(carAssignment.price())
                .interestRate(carAssignment.interestRate())
                .rankBonusId(getRankBonusId(rankBonus))
                .memberInitial(getMemberInitialOrNull(carAssignment, rankBonus))
                .initialInstallmentsCount(carAssignment.initialInstallmentsCount())
                .monthlyInstallmentsCount(carAssignment.monthlyInstallmentsCount())
                .paymentStartDate(carAssignment.paymentStartDate())
                .assignedDate(getAssignedDate(carAssignment.quotationId(), carAssignment.assignedDate()))
                .isAssigned(getStatus(carAssignment.quotationId()))
                .build();
    }

    /**
     * Prepares a car assignment for update
     */
    public CarAssignment prepareForUpdate(
            CarAssignment carAssignment,
            CarAssignment existingAssignment,
            CarRankBonus rankBonus,
            Classification classification
    ) {
        return existingAssignment.toBuilder()
                .quotationId(getQuotationIdOrNull(carAssignment))
                .memberId(getMemberIdOrNull(classification))
                .price(carAssignment.price())
                .interestRate(carAssignment.interestRate())
                .rankBonusId(getRankBonusId(rankBonus))
                .memberInitial(getMemberInitialOrNull(carAssignment, rankBonus))
                .initialInstallmentsCount(carAssignment.initialInstallmentsCount())
                .monthlyInstallmentsCount(carAssignment.monthlyInstallmentsCount())
                .paymentStartDate(carAssignment.paymentStartDate())
                .assignedDate(getAssignedDate(carAssignment.quotationId(), existingAssignment.assignedDate()))
                .isAssigned(getStatus(carAssignment.quotationId()))
                .build();
    }

    private BigDecimal getMemberInitialOrNull(CarAssignment carAssignment, CarRankBonus carRankBonus) {
        if (carRankBonus == null) return null;
        BigDecimal carPrice = carAssignment.price();
        BigDecimal bonusPrice = carRankBonus.bonusPrice();
        BigDecimal result = carPrice.subtract(bonusPrice);
        return result.compareTo(BigDecimal.ZERO) < 0 ? null : result;
    }

    private UUID getQuotationIdOrNull(CarAssignment carAssignment) {
        return carAssignment.quotationId() != null ? carAssignment.quotationId() : null;
    }

    private Long getMemberIdOrNull(Classification classification) {
        return classification != null ? classification.memberId() : null;
    }

    private Boolean getStatus(UUID carQuotationId) {
        return carQuotationId != null;
    }

    private Instant getAssignedDate(UUID carQuotationId, Instant existingAssignedDate) {
        return carQuotationId != null ? Instant.now() : existingAssignedDate;
    }

    private UUID getRankBonusId(CarRankBonus rankBonus) {
        return rankBonus != null ? rankBonus.id() : null;
    }

}